use {
    crate::{
        app_data::TestAppData,
        error::Error,
        game_session::{Channel, ChannelError, GameSessionError, Message, api::ws::WsChannelError},
        quiz::{QuizError, test::create_one},
    },
    actix_ws::Closed,
    serde::Serialize,
    std::sync::{
        Arc,
        atomic::{AtomicBool, Ordering},
        mpsc,
    },
    uuid::Uuid,
};

struct DummyChanel<T> {
    id: u64,
    closed: Arc<AtomicBool>,
    sender: mpsc::Sender<T>,
}

impl<T: Serialize + Sync + Send + Clone> DummyChanel<T> {
    pub fn new() -> (Self, Arc<AtomicBool>, mpsc::Receiver<T>) {
        let (sender, receiver) = mpsc::channel();
        let closed = Arc::new(AtomicBool::new(false));
        let _self = Self {
            id: <Self as Channel<T>>::generate_id(),
            closed: closed.clone(),
            sender,
        };
        (_self, closed, receiver)
    }
}

#[async_trait::async_trait]
impl<T: Serialize + Sync + Send + Clone> Channel<T> for DummyChanel<T> {
    async fn send(&mut self, msg: Message<'_, T>) -> Result<(), ChannelError> {
        match self.closed.load(Ordering::Relaxed) {
            true => Err(WsChannelError::Tx(Closed).into()),
            false => self
                .sender
                .send(msg.msg.clone())
                .map_err(|_| WsChannelError::Tx(Closed).into()),
        }
    }
    async fn close(self: Box<Self>) {
        self.closed.store(true, Ordering::Relaxed);
    }
    fn id(&self) -> u64 {
        self.id
    }
}

#[actix_web::test]
async fn create_get_session() {
    let data = TestAppData::test().await;
    let user = data.dummy_user().await;

    {
        let (code, _) = data
            .game_sessions
            .create_session(&data.db, user.clone(), None)
            .await
            .unwrap();
        let session = data.game_sessions.get_session(code).await.unwrap();
        let session = session.lock().await;
        assert_eq!(session.host.user.id, user.id);
        assert!(session.quiz.is_none());
    }

    {
        let quiz = create_one(&data.db, user.id, Some("test quiz".into()), None, false)
            .await
            .unwrap();
        let (code, _) = data
            .game_sessions
            .create_session(&data.db, user.clone(), Some(quiz.id))
            .await
            .unwrap();
        let session = data.game_sessions.get_session(code).await.unwrap();
        let session = session.lock().await;

        assert_eq!(session.host.user.id, user.id);
        let session_quiz = session.quiz.as_ref().unwrap();
        assert_eq!(session_quiz.model.id, quiz.id);
    }

    assert!(matches!(
        data.game_sessions.get_session(u32::MAX).await,
        Err(GameSessionError::InvalidCode)
    ))
}

#[actix_web::test]
async fn check_set_host_channel() {
    let data = TestAppData::test().await;
    let user = data.dummy_user().await;

    let (_, session) = data
        .game_sessions
        .create_session(&data.db, user.clone(), None)
        .await
        .unwrap();
    let mut session = session.lock().await;

    session.check_set_host_channel(&user).unwrap();
    let (channel1, closed1, _) = DummyChanel::new();
    session.set_host_channel(channel1).await;
    session.check_set_host_channel(&user).unwrap();
    assert!(!closed1.load(Ordering::Relaxed));

    let (channel2, closed2, _) = DummyChanel::new();
    session.set_host_channel(channel2).await;
    assert!(closed1.load(Ordering::Relaxed));
    assert!(!closed2.load(Ordering::Relaxed));

    let user2 = data.dummy_user().await;
    assert!(matches!(
        session.check_set_host_channel(&user2),
        Err(GameSessionError::Forbidden)
    ));
}

#[actix_web::test]
async fn create_session_invalid_quiz() {
    let data = TestAppData::test().await;
    let user = data.dummy_user().await;
    let user2 = data.dummy_user().await;

    let res = data
        .game_sessions
        .create_session(&data.db, user.clone(), Some(Uuid::new_v4()))
        .await;
    assert!(matches!(res, Err(Error::Quiz(QuizError::NotFound))));

    let quiz = create_one(&data.db, user.id, Some("test quiz".into()), None, false)
        .await
        .unwrap();
    let res = data
        .game_sessions
        .create_session(&data.db, user2, Some(quiz.id))
        .await;
    assert!(matches!(res, Err(Error::Quiz(QuizError::Forbidden))));
}

#[actix_web::test]
async fn delete_session() {
    let data = TestAppData::test().await;
    let user = data.dummy_user().await;
    let wrong_user = data.dummy_user().await;

    let (code, _) = data
        .game_sessions
        .create_session(&data.db, user.clone(), None)
        .await
        .unwrap();

    assert!(matches!(
        data.game_sessions.delete_session(&wrong_user, code).await,
        Err(GameSessionError::Forbidden)
    ));
    assert!(data.game_sessions.get_session(code).await.is_ok());

    data.game_sessions
        .delete_session(&user, code)
        .await
        .unwrap();
    assert!(matches!(
        data.game_sessions.get_session(code).await,
        Err(GameSessionError::InvalidCode)
    ));
}

use {
    super::Result,
    crate::{
        core::Error,
        entities::{prelude::Quiz, quiz},
        update_value::{UpdateOption, UpdateValue},
    },
    sea_orm::{
        ActiveModelTrait, ActiveValue::Set, ColumnTrait, ConnectionTrait, EntityTrait,
        IntoActiveModel, ModelTrait, QueryFilter, TransactionTrait, prelude::Uuid,
        sqlx::types::chrono::Utc,
    },
    serde::Deserialize,
};

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NewQuiz {
    title: String,
    description: Option<String>,
    #[serde(default)]
    hidden: bool,
}

pub async fn create_one(
    conn: &impl ConnectionTrait,
    user: Uuid,
    quiz: &NewQuiz,
) -> Result<quiz::Model> {
    let now = Utc::now();
    let quiz = quiz::ActiveModel {
        id: Set(Uuid::new_v4()),
        user: Set(user),
        title: Set(quiz.title.clone()),
        description: Set(quiz.description.clone()),
        hidden: Set(quiz.hidden),
        created: Set(now),
        modified: Set(now),
    };

    quiz.insert(conn).await.map_err(Error::Database)
}

pub async fn create_many(
    conn: &impl TransactionTrait,
    user: Uuid,
    quizzes: &[NewQuiz],
) -> Result<Vec<quiz::Model>> {
    let tx = conn.begin().await.map_err(Error::Database)?;
    let mut created_quizzes = Vec::with_capacity(quizzes.len());

    for quiz in quizzes.iter() {
        let quiz = create_one(&tx, user, quiz).await?;
        created_quizzes.push(quiz);
    }

    tx.commit().await.map_err(Error::Database)?;
    Ok(created_quizzes)
}

#[derive(Deserialize, Debug)]
pub struct QuizFilter {
    hidden: Option<bool>,
}

pub async fn get_many(
    conn: &impl ConnectionTrait,
    user: Uuid,
    filter: &QuizFilter,
) -> Result<Vec<quiz::Model>> {
    let mut query = Quiz::find().filter(quiz::Column::User.eq(user));

    if let Some(hidden) = filter.hidden {
        query = query.filter(quiz::Column::Hidden.eq(hidden));
    }

    query.all(conn).await.map_err(Error::Database)
}

pub async fn get_one(conn: &impl ConnectionTrait, user: Uuid, id: Uuid) -> Result<quiz::Model> {
    let quiz = Quiz::find_by_id(id)
        .one(conn)
        .await
        .map_err(Error::Database)?;
    let quiz = quiz.ok_or(Error::NotFound)?;
    if quiz.user != user {
        Err(Error::Forbidden)
    } else {
        Ok(quiz)
    }
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PatchQuiz {
    #[serde(default)]
    title: UpdateValue<String>,
    #[serde(default)]
    description: UpdateOption<String>,
    #[serde(default)]
    hidden: UpdateValue<bool>,
}

pub async fn patch(
    conn: &impl ConnectionTrait,
    user: Uuid,
    id: Uuid,
    patch_quiz: &PatchQuiz,
) -> Result<quiz::Model> {
    let mut quiz = get_one(conn, user, id).await?.into_active_model();

    quiz.title = patch_quiz.title.clone().into();
    quiz.description = patch_quiz.description.clone().into();
    quiz.hidden = patch_quiz.hidden.into();

    quiz.update(conn).await.map_err(Error::Database)
}

pub async fn delete(conn: &impl ConnectionTrait, user: Uuid, id: Uuid) -> Result<()> {
    let quiz = get_one(conn, user, id).await?;
    quiz.delete(conn).await.map_err(Error::Database)?;
    Ok(())
}

#[cfg(test)]
pub mod test {
    use {super::*, crate::AppData, std::time::Duration};

    #[actix_web::test]
    async fn test_create_one() {
        let conn = &AppData::test().await.db;
        let user = Uuid::new_v4();

        let input = NewQuiz {
            title: "Test Quiz".into(),
            description: Some("desc".into()),
            hidden: false,
        };

        let quiz = create_one(conn, user, &input).await.unwrap();

        assert_eq!(quiz.title, "Test Quiz");
        assert_eq!(quiz.description.as_deref(), Some("desc"));
        assert_eq!(quiz.hidden, false);
        assert_eq!(quiz.user, user);
        assert_eq!(quiz.created, quiz.modified);
        assert!(quiz.created > Utc::now() - Duration::from_secs(5));
    }

    #[actix_web::test]
    async fn test_create_many() {
        let conn = &AppData::test().await.db;
        let user = Uuid::new_v4();

        let input = vec![
            NewQuiz {
                title: "Quiz 1".into(),
                description: None,
                hidden: false,
            },
            NewQuiz {
                title: "Quiz 2".into(),
                description: Some("desc".into()),
                hidden: true,
            },
        ];

        create_many(conn, Uuid::new_v4(), &input).await.unwrap();
        let quizzes = create_many(conn, user, &input).await.unwrap();
        assert_eq!(quizzes.len(), 2);
        assert_eq!(quizzes[0].title, "Quiz 1");
        assert_eq!(quizzes[1].title, "Quiz 2");
        assert_eq!(quizzes[1].hidden, true);
    }

    #[actix_web::test]
    async fn test_get_many() {
        let conn = &AppData::test().await.db;
        let user = Uuid::new_v4();

        let input = vec![
            NewQuiz {
                title: "Visible".into(),
                description: None,
                hidden: false,
            },
            NewQuiz {
                title: "Hidden".into(),
                description: Some("desc".into()),
                hidden: true,
            },
        ];

        create_many(conn, Uuid::new_v4(), &input).await.unwrap();
        create_many(conn, user, &input).await.unwrap();

        let result = get_many(
            conn,
            user,
            &QuizFilter {
                hidden: Some(false),
            },
        )
        .await
        .unwrap();

        assert_eq!(result.len(), 1);
        assert_eq!(result[0].title, "Visible");

        let result = get_many(conn, user, &QuizFilter { hidden: Some(true) })
            .await
            .unwrap();

        assert_eq!(result.len(), 1);
        assert_eq!(result[0].title, "Hidden");

        let result = get_many(conn, user, &QuizFilter { hidden: None })
            .await
            .unwrap();

        assert_eq!(result.len(), 2);
    }

    #[actix_web::test]
    async fn test_get_one() {
        let conn = &AppData::test().await.db;
        let user = Uuid::new_v4();

        let quiz = create_one(
            conn,
            user,
            &NewQuiz {
                title: "Single".into(),
                description: None,
                hidden: false,
            },
        )
        .await
        .unwrap();

        let fetched = get_one(conn, user, quiz.id).await.unwrap();
        assert_eq!(fetched, quiz);

        let other_user = Uuid::new_v4();
        let fetched = get_one(conn, other_user, quiz.id).await;
        assert!(matches!(fetched, Err(Error::Forbidden)));
    }

    #[actix_web::test]
    async fn test_patch() {
        let conn = &AppData::test().await.db;
        let user = Uuid::new_v4();

        let quiz = create_one(
            conn,
            user,
            &NewQuiz {
                title: "Old".into(),
                description: Some("old".into()),
                hidden: false,
            },
        )
        .await
        .unwrap();

        let patch_data = PatchQuiz {
            title: UpdateValue::Set("New".into()),
            description: UpdateOption::Set(None),
            hidden: UpdateValue::Unset,
        };

        let updated = patch(conn, user, quiz.id, &patch_data).await.unwrap();

        assert_eq!(updated.title, "New");
        assert_eq!(updated.description.as_deref(), None);
        assert_eq!(updated.hidden, false);
    }

    #[actix_web::test]
    async fn test_delete() {
        let conn = &AppData::test().await.db;
        let user = Uuid::new_v4();

        let quiz = create_one(
            conn,
            user,
            &NewQuiz {
                title: "Delete me".into(),
                description: None,
                hidden: false,
            },
        )
        .await
        .unwrap();

        let result = get_one(conn, user, quiz.id).await;
        assert!(matches!(result, Ok(_)));

        delete(conn, user, quiz.id).await.unwrap();

        let result = get_one(conn, user, quiz.id).await;
        assert!(matches!(result, Err(Error::NotFound)));
    }
}

use {
    crate::{
        error::{Error, Result},
        quiz::{
            NewQuiz, QuizFilter, UpdateQuiz,
            entity::{ActiveQuiz, Quiz, QuizColumn, QuizEntity},
        },
    },
    sea_orm::{
        ActiveModelTrait,
        ActiveValue::{self, Set},
        ColumnTrait, ConnectionTrait, EntityTrait, IntoActiveModel, QueryFilter, TransactionTrait,
        sqlx::types::chrono::Utc,
    },
    uuid::Uuid,
};

impl Quiz {
    pub async fn create(conn: &impl ConnectionTrait, user: Uuid, quiz: NewQuiz) -> Result<Self> {
        let now = Utc::now();
        let quiz = ActiveQuiz {
            id: Set(Uuid::new_v4()),
            user: Set(user),
            title: Set(quiz.title),
            description: Set(quiz.description),
            hidden: Set(quiz.hidden),
            created: Set(now),
            modified: Set(now),
        };

        quiz.insert(conn).await.map_err(Error::Database)
    }

    pub async fn create_many(
        conn: &impl TransactionTrait,
        user: Uuid,
        quizzes: Vec<NewQuiz>,
    ) -> Result<Vec<Self>> {
        let tx = conn.begin().await.map_err(Error::Database)?;
        let mut created_quizzes = Vec::with_capacity(quizzes.len());

        for quiz in quizzes {
            let quiz = Self::create(&tx, user, quiz).await?;
            created_quizzes.push(quiz);
        }

        tx.commit().await.map_err(Error::Database)?;
        Ok(created_quizzes)
    }

    pub async fn get(conn: &impl ConnectionTrait, user: Uuid, id: Uuid) -> Result<Self> {
        let quiz = QuizEntity::find_by_id(id)
            .one(conn)
            .await
            .map_err(Error::Database)?;

        let quiz = quiz.ok_or(Error::NotFound)?;
        if quiz.user != user {
            return Err(Error::Forbidden);
        }

        Ok(quiz)
    }

    pub async fn get_many(
        conn: &impl ConnectionTrait,
        user: Uuid,
        filter: &QuizFilter,
    ) -> Result<Vec<Self>> {
        let mut query = QuizEntity::find().filter(QuizColumn::User.eq(user));

        if let Some(hidden) = filter.hidden {
            query = query.filter(QuizColumn::Hidden.eq(hidden));
        }

        query.all(conn).await.map_err(Error::Database)
    }

    pub async fn update(
        self,
        conn: &impl ConnectionTrait,
        update_quiz: UpdateQuiz,
    ) -> Result<Self> {
        let mut model = self.into_active_model();

        model.title = update_quiz.title.into();
        model.description = update_quiz.description.into();
        model.hidden = update_quiz.hidden.into();
        model.modified = ActiveValue::set(Utc::now());

        model.update(conn).await.map_err(Error::Database)
    }

    pub async fn delete(self, conn: &impl ConnectionTrait) -> Result<()> {
        self.into_active_model()
            .delete(conn)
            .await
            .map_err(Error::Database)?;
        Ok(())
    }
}

use {
    crate::{
        AppData,
        auth::User,
        error::Result,
        question::{NewQuestion, UpdateQuestion},
        quiz::entity::QuizModel,
    },
    actix_web::{HttpResponse, delete, get, patch, post, put, web},
    uuid::Uuid,
};

#[post("/quizzes/{quiz}/questions")]
async fn create_one(
    question: web::Json<NewQuestion>,
    app_data: web::Data<AppData>,
    user: User,
    id: web::Path<Uuid>,
) -> Result<HttpResponse> {
    let quiz = QuizModel::get(&app_data.db, user.id, id.into_inner()).await?;
    let question = quiz
        .create_question(&app_data.db, question.into_inner())
        .await?;

    Ok(HttpResponse::Created().json(question))
}

#[get("/quizzes/{quiz}/questions/{question}")]
async fn get_one(
    id: web::Path<(Uuid, Uuid)>,
    app_data: web::Data<AppData>,
    user: User,
) -> Result<HttpResponse> {
    let (quiz_id, question_id) = id.into_inner();

    let quiz = QuizModel::get(&app_data.db, user.id, quiz_id).await?;
    let question = quiz.get_question(&app_data.db, question_id).await?;
    let question = question.get_answers(&app_data.db).await?;

    Ok(HttpResponse::Ok().json(question))
}

#[get("/quizzes/{quiz}/questions")]
async fn get_many(
    id: web::Path<Uuid>,
    app_data: web::Data<AppData>,
    user: User,
) -> Result<HttpResponse> {
    let quiz = QuizModel::get(&app_data.db, user.id, id.into_inner()).await?;
    let questions = quiz.get_questions(&app_data.db).await?;
    Ok(HttpResponse::Ok().json(questions))
}

#[patch("/quizzes/{quiz}/questions/{question}")]
async fn patch(
    id: web::Path<(Uuid, Uuid)>,
    update_question: web::Json<UpdateQuestion>,
    app_data: web::Data<AppData>,
    user: User,
) -> Result<HttpResponse> {
    let (quiz_id, question_id) = id.into_inner();

    let quiz = QuizModel::get(&app_data.db, user.id, quiz_id).await?;
    let question = quiz.get_question(&app_data.db, question_id).await?;
    let question = question.get_answers(&app_data.db).await?;
    let question = question
        .update(quiz, &app_data.db, update_question.into_inner())
        .await?;

    Ok(HttpResponse::Ok().json(question))
}

#[put("/quizzes/{quiz}/questions/{question}")]
async fn put(
    id: web::Path<(Uuid, Uuid)>,
    new_question: web::Json<NewQuestion>,
    app_data: web::Data<AppData>,
    user: User,
) -> Result<HttpResponse> {
    let (quiz_id, question_id) = id.into_inner();

    let quiz = QuizModel::get(&app_data.db, user.id, quiz_id).await?;
    let question = quiz.get_question(&app_data.db, question_id).await?;
    let question = question.get_answers(&app_data.db).await?;
    let question = question
        .update(quiz, &app_data.db, new_question.into_inner().into())
        .await?;

    Ok(HttpResponse::Ok().json(question))
}

#[delete("/quizzes/{quiz}/questions/{question}")]
async fn delete(
    id: web::Path<(Uuid, Uuid)>,
    app_data: web::Data<AppData>,
    user: User,
) -> Result<HttpResponse> {
    let (quiz_id, question_id) = id.into_inner();

    let quiz = QuizModel::get(&app_data.db, user.id, quiz_id).await?;
    let question = quiz.get_question(&app_data.db, question_id).await?;
    question.delete(&app_data.db).await?;

    Ok(HttpResponse::NoContent().finish())
}

pub fn init(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.service(create_one);
    cfg.service(get_one);
    cfg.service(get_many);
    cfg.service(patch);
    cfg.service(put);
    cfg.service(delete);
}

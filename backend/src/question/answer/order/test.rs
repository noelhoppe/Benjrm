use crate::{
    app_data::TestAppData,
    question::{
        NewQuestion, NewQuestionOptions, QuestionOptions, QuestionType, UpdateQuestion,
        UpdateQuestionOptions,
        answer::order::{NewAnswerOrder, UpdateAnswerOrder, UpdateAnswerOrderEnum},
    },
    quiz::test::create_one,
    update_value::UpdateValue::{Set, Unset},
};

#[actix_web::test]
async fn update_options() {
    let data = TestAppData::test().await;
    let user = data.dummy_user_id().await;
    let quiz = create_one(&data.db, user, None, None, false).await.unwrap();

    let new_question = NewQuestion {
        question: "Question".into(),
        hidden: true,
        position: None,
        options: NewQuestionOptions::Order {
            options: vec![
                NewAnswerOrder { text: "A".into() },
                NewAnswerOrder { text: "B".into() },
                NewAnswerOrder {
                    text: "Delete".into(),
                },
            ],
        },
    };

    let question = quiz
        .clone()
        .create_question(&data.db, new_question)
        .await
        .unwrap();

    let options = match question.options.clone() {
        QuestionOptions::Order { options } => options,
        _ => panic!(),
    };

    let options = vec![
        UpdateAnswerOrderEnum::New(NewAnswerOrder {
            text: "first".into(),
        }),
        UpdateAnswerOrderEnum::Update(UpdateAnswerOrder {
            id: options[1].id,
            text: Set("b".into()),
        }),
        UpdateAnswerOrderEnum::New(NewAnswerOrder {
            text: "middle_1".into(),
        }),
        UpdateAnswerOrderEnum::New(NewAnswerOrder {
            text: "middle_2".into(),
        }),
        UpdateAnswerOrderEnum::New(NewAnswerOrder {
            text: "middle_3".into(),
        }),
        UpdateAnswerOrderEnum::Update(UpdateAnswerOrder {
            id: options[0].id,
            text: Set("a".into()),
        }),
        UpdateAnswerOrderEnum::New(NewAnswerOrder {
            text: "last".into(),
        }),
    ];

    let update_question = UpdateQuestion {
        question: Unset,
        hidden: Unset,
        position: None,
        options: Some(UpdateQuestionOptions::Order { options }),
    };

    let question = question
        .update(quiz.clone(), &data.db, update_question)
        .await
        .unwrap();

    let inserted_options = match question.options {
        QuestionOptions::Order { options } => options,
        _ => panic!(),
    };

    assert_eq!(inserted_options.len(), 7);
    assert_eq!(inserted_options[0].text, "first");
    assert_eq!(inserted_options[1].text, "b");
    assert_eq!(inserted_options[2].text, "middle_1");
    assert_eq!(inserted_options[3].text, "middle_2");
    assert_eq!(inserted_options[4].text, "middle_3");
    assert_eq!(inserted_options[5].text, "a");
    assert_eq!(inserted_options[6].text, "last");
}

#[actix_web::test]
pub async fn create_order_question() {
    let data = TestAppData::test().await;
    let user = data.dummy_user_id().await;

    let quiz = create_one(&data.db, user, None, None, false).await.unwrap();

    let new_question = NewQuestion {
        question: "Question".into(),
        hidden: true,
        position: None,
        options: NewQuestionOptions::Order {
            options: vec![
                NewAnswerOrder { text: "A".into() },
                NewAnswerOrder { text: "B".into() },
            ],
        },
    };

    let question = quiz
        .clone()
        .create_question(&data.db, new_question)
        .await
        .unwrap();

    assert_eq!(question.model.r#type, QuestionType::Order);

    let options = match question.options {
        QuestionOptions::Order { options } => options,
        _ => panic!("Type missmatch"),
    };

    assert_eq!(
        QuestionType::Order.get_answer_table(),
        QuestionType::SingleChoice
    );

    assert_eq!(options[0].text, String::from("A"));
    assert_eq!(options[1].text, String::from("B"));
}

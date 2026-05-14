mod api;
mod core;
mod entity;
#[cfg(test)]
mod test;

pub use api::init;
use serde::Deserialize;

use crate::update_value::{UpdateOption, UpdateValue};

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NewQuiz {
    title: String,
    description: Option<String>,
    #[serde(default)]
    hidden: bool,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UpdateQuiz {
    #[serde(default)]
    title: UpdateValue<String>,
    #[serde(default)]
    description: UpdateOption<String>,
    #[serde(default)]
    hidden: UpdateValue<bool>,
}

#[derive(Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct QuizFilter {
    hidden: Option<bool>,
}

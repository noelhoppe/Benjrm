import schemathesis
from hypothesis import strategies as st
import uuid


@schemathesis.hook("before_generate_body")
def before_generate_body(context, strategy):
    operation = context.operation

    # Only apply to createQuestion endpoint
    if operation.path != "/api/v1/quizzes/{quizId}/questions" or operation.method != "post":
        return strategy

    @st.composite
    def valid_question_body(draw):
        question_text = draw(st.text(min_size=1, max_size=200))
        hidden = draw(st.booleans())

        question_type = draw(st.sampled_from(["SLIDE", "SINGLE_CHOICE", "MULTIPLE_CHOICE", "ORDER"]))

        body = {
            "question": question_text,
            "hidden": hidden,
            "type": question_type,
        }

        # Only add options if type is not SLIDE
        if question_type != "SLIDE":
            num_options = draw(st.integers(min_value=2, max_value=4))

            if question_type == "ORDER":
                body["options"] = [
                    {"answer": draw(st.text(min_size=1, max_size=100))}
                    for _ in range(num_options)
                ]
            else:  # SINGLE_CHOICE or MULTIPLE_CHOICE
                body["options"] = [
                    {
                        "answer": draw(st.text(min_size=1, max_size=100)),
                        "correct": draw(st.booleans())
                    }
                    for _ in range(num_options)
                ]

        # Optionally add position
        if draw(st.booleans()):
            if draw(st.booleans()):
                body["prev"] = str(uuid.uuid4())
            else:
                body["next"] = str(uuid.uuid4())

        return body

    return valid_question_body()

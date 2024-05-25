from flask import Flask, jsonify, request
from flask_cors import CORS
import pickle
import pandas as pd
import mysql.connector
from mysql.connector import Error


app = Flask(__name__)
CORS(app)

# database sql
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="YES",
    database="LearnAiDatabase",
    auth_plugin="mysql_native_password",
)

mycursor = db.cursor()


# Load the DataFrame from a pickle file
df = pd.read_pickle("dataframe.pkl")
first_standard = pd.read_pickle("1st.pkl")


def generate_follow_up_question(topic, subject, change, diff, df):
    # Filter the DataFrame by topic and subject
    filtered_df = df[(df["Topic"] == topic) & (df["Subject"] == subject)]

    # Determine the difficulty range based on the change
    if change == "harder":
        filtered_df = filtered_df[filtered_df["Difficulty"] >= diff]
    elif change == "easier":
        filtered_df = filtered_df[filtered_df["Difficulty"] <= diff]

    # Check if any questions match the criteria
    if filtered_df.empty:
        # If no matching questions, select a random question from the original DataFrame
        follow_up_question = df.sample().iloc[0]
    else:
        # Select a question from the filtered DataFrame
        follow_up_question = filtered_df.sample().iloc[0]

    # Create a dictionary with the follow-up question details
    follow_up_question_data = {
        "Question": follow_up_question["Question"],
        "Options": follow_up_question["Options"],
        "Correct Option": follow_up_question["Correct Option"],
        "Topic": follow_up_question["Topic"],
        "Subject": follow_up_question["Subject"],
        "Difficulty": follow_up_question["Difficulty"],
    }

    return follow_up_question_data


def encoded_version(first_standard):

    # first_standard = pd.DataFrame(first_standard)
    questions = ""
    options = ""
    c_option = ""
    subject = ""
    topic = ""
    difficulty = ""

    for ques in first_standard["Question"]:
        questions += "(nexxxtt_questionnn)" + ques
    for opt in first_standard["Options"]:
        options += "(nexxxtt_questionnn)" + "".join(opt)
    for copt in first_standard["Correct Option"]:
        c_option += "(nexxxtt_questionnn)" + copt
    for tpc in first_standard["Topic"]:
        topic += "(nexxxtt_questionnn)" + tpc
    for sub in first_standard["Subject"]:
        subject += "(nexxxtt_questionnn)" + sub
    for dif in first_standard["Difficulty"]:
        difficulty += "(nexxxtt_questionnn)" + dif
    return questions, options, c_option, subject, topic, difficulty


@app.route("/app_todo", methods=["POST"])
def add_todo():
    data = request.json
    questions, options, c_option, subject, topic, difficulty = encoded_version(
        first_standard
    )
    # Return the base64-encoded DataFrame as part of the JSON response
    return (
        jsonify(
            {
                "question": questions,
                "options": options,
                "correct_option": c_option,
                "topic": topic,
                "subject": subject,
                "difficulty": difficulty,
            }
        ),
        200,
    )


@app.route("/submit", methods=["POST"])
def result():
    data = request.json
    name = "user1"
    age = 10
    class_number = 1
    normalized_data = {
        "questions": list(data["questionsArray"]),
        "options": list(data["optionsArray"]),
        "correctOptions": list(data["correctOptionsArray"]),
        "subjects": list(data["subjectsArray"]),
        "topics": list(data["topicsArray"]),
        "selectedAnswers": list(data["selectedAnswers"].values()),
        "difficulty": list(data["difficultyArray"]),
    }
    response_data = pd.DataFrame(normalized_data)
    response_data["change"] = (
        response_data["correctOptions"] == "(" + response_data["selectedAnswers"]
    )
    response_data["change"] = response_data["change"].astype(int)

    global df
    follow_up_questions = []

    for index, row in response_data.iterrows():
        topic = row["topics"]
        subject = row["subjects"]
        diff = row["difficulty"]
        print(row)
        change = "harder" if row["change"] == 1 else "easier"
        if change == "harder":
            df = df[df["Question"] != row["questions"]]

        try:
            mycursor.execute(
                "INSERT INTO users_data (name, age, class_number, topic, subject,difficulty, ans) VALUES (%s, %s, %s, %s, %s, %s,%s)",
                (name, age, class_number, topic, subject, diff, row["change"]),
            )
            db.commit()
        except Error as e:
            print(f"Error: {e}")
            return jsonify({"status": "error", "message": str(e)}), 500

        follow_up_question = generate_follow_up_question(
            topic, subject, change, row["difficulty"], df
        )
        follow_up_questions.append(follow_up_question)
    follow_up_questions = pd.DataFrame(follow_up_questions)
    questions, options, c_option, subject, topic, difficulty = encoded_version(
        follow_up_questions
    )
    return (
        jsonify(
            {
                "question": questions,
                "options": options,
                "correct_option": c_option,
                "topic": topic,
                "subject": subject,
                "difficulty": difficulty,
            }
        ),
        200,
    )


@app.route("/analysis", methods=["POST"])
def analysis():

    return (jsonify("heylosl"), 200)


if __name__ == "__main__":
    app.run(debug=True)

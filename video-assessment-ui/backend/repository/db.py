
import os

from dotenv import load_dotenv
from mysql.connector import pooling

load_dotenv()

db = pooling.MySQLConnectionPool(
    pool_name="assessment_pool",
    pool_size=10,
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)


def test_connection():
    try:
        connection = db.get_connection()

        print("MySQL Database Connected Successfully!")

        connection.close()

    except Exception as error:
        print("Database Connection Failed:", error)


test_connection()

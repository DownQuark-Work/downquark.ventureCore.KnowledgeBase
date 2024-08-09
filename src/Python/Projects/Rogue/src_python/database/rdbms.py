import mysql.connector
from mysql.connector.abstracts import MySQLConnectionAbstract

cnxn: MySQLConnectionAbstract = None
crsr = None

database_connection_cursor = [cnxn, crsr]
def create_mysql_connection():
    return mysql.connector.connect(
      host="localhost",
      user="root",
      password="root",
      port="3366"
    )


def dyn_connect_cursor():
    if database_connection_cursor[0] is None:
        database_connection_cursor[0] = create_mysql_connection()
    if database_connection_cursor[1] is None:
        database_connection_cursor[1] = database_connection_cursor[0].cursor()


def no_print_db():
    """for use when no local db is running"""
    print('running locally without database')


def print_dbs():
    dyn_connect_cursor()
    database_connection_cursor[1].execute("SHOW SCHEMAS")
    for db in database_connection_cursor[1]:
        print(db)

from sqlalchemy.orm import Query, Session
from Program.DB import db, query_db

def Insert(input_query: Query):
    '''
    Function to Query the Database, simple function to query the database.
    Since each file is scanned for non-valid imports, query security is not needed.

    Paramaters:
        input_query (obj): A Valid SQL Alchemy Query is passed to the query i.e:

        '''

    engine = query_db()

    session = Session(engine)

    response = session.query(input_query)

    return response
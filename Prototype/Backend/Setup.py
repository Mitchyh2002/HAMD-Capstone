from create_db import sys_create

def db_conn():
    db_conn_string = input("Please Enter DB Connection String")

    with open("Program/DB/Builder.py", "r") as db_file_read:
        content = db_file_read.readlines()
        for i, line in enumerate(content):
            if 'url = ' in line:
                content.pop(i)
                content.insert(i, f"url = '{db_conn_string}'\n")
    with open("Program/DB/Builder.py", "w") as db_file_write:
        db_file_write.writelines(content)

    return db_conn_string


if __name__ == "__main__":
    db_conn()
    sys_create()
    print("System Setup Please Run Main")
import datetime

from Program.Module.mst.Module import scan_file
from Program.DB.Models.mst.User import PasswordHash, User
from werkzeug.serving import run_simple

from Program import init_app

def scan_file_test():
    print("\nTesting Program.Module.mst.Module function scan_file")
    answers = [0,
               {'Success': False, 'StatusCode': 11, 'Message': 'Restricted Module found in application'},
               {'Success': False, 'StatusCode': 12, 'Message': 'Syntax Error Found in IncorrectSyntax.py'}]
    num_correct = 0
    total_tests = 3

    with open("./TestFiles/ScanFile/Correct.py") as file_1:
        out_1 = scan_file(file_1)
        if out_1 == answers[0]:
            print("Test 1: Passed {Case: Correct Upload}")
            num_correct += 1
        else:
            print(f"Test 1: Failed - Expected {answers[0]} Given: {out_1}")
    with open("./TestFiles/ScanFile/IllegalImport.py") as file_2:
        out_2 = scan_file(file_2)
        if out_2 == answers[1]:
            print("Test 2: Passed {Case: Illegal Import}")
            num_correct += 1
        else:
            print(f"Test 2: Failed - Expected {answers[1]} Given: {out_2}")
    with open("./TestFiles/ScanFile/IncorrectSyntax.py") as file_3:
        out_3 = scan_file(file_3)
        if out_3 == answers[2]:
            print("Test 3: Passed {Case: Incorrect Syntax}")
            num_correct += 1
        else:
            print(f"Test 2: Failed - Expected {answers[2]} Given: {out_3}")

    print(f"Tests Passed {num_correct}/{total_tests}\n")

def test_getactive(client):
    modules = client.get("module/getactive").json["Values"]
    testing_modules = ['grp', 'mst']

    correct = 0
    for module in modules:
        if module['displayName'] in testing_modules:
            correct += 1

    print(f"Testing Modules/GetActive Endpoint {correct}/{len(testing_modules)} found")


if __name__ == "__main__":
    app = init_app()
    app.config.update({
        "TESTING": True
    })
    client = app.test_client()
    test_genuser(client)

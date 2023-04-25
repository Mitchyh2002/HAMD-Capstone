from Program.DB import create_db
from Program.DB.Builder import builder
import json

if __name__ == "__main__":
    create_db()

    test_json = "Test.json"
    with open(test_json, "r") as model:
        content = model.read()
        module_data = json.loads(content)
        builder(module_data)

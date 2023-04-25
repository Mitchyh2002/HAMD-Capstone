import json
from Program.DB import db, engine


class builder:
    """Builder Class that is used to create the module in the database as well as any relevant Tables.
    This will do the following:
        For all Tables the new Model will appear in the Models Folder this will be in the format
            ModuleName_TableName
        The New Modules Created will be added to the table, all Foreign Keys are set to cascade delete
        (On Table Deletion Delete any dependencies from the table)

    Parameters:
        Module (dict): A Valid JSON File containing the following keys:
        "ModuleName": This will be the parent module that has created the database this will be appended to the tablename
        to ensure no duplicates

        "Memberships": This describes the membership access levels that this module should be given too. If BLANK give
        to all or no-one?

        "Tables": A dictionary containing the tables that this module needs to be added into the database
        (See Create Database Tables for More info)

        ParentModule: Unsure if required depends on ops requirements.

    Returns:
        NONE

    """

    # String containing all the relevant imports for each module. Leave 3 new lines at the end for tidiness
    #This will exist on the top n lines of the file.
    IMPORTS = """from Program.DB import db 
from sqlalchemy import Column, ForeignKey 
from sqlalchemy.types import * \n \n \n"""

    def __init__(self, Module: dict):

        module_name = Module.get("ModuleName")
        UAC = Module.get("MemberShips")

        self.create_tables(Module.get("Tables"), module_name)

        ParentModule = Module.get("Parent Module")

    def create_tables(self, tables, module_name: str):
        """ Generic Function to create a new module object to be added to the database,
        On successful completion a new Table will be created  in the database.

        Parameters:
            tables (dict): dictionary containing all table information
            module_name (str): String Containing the Module Name

        Returns:
            None: New .py file will be added to the ./Modules Directory.

                """
        for table in tables:
            table_name = f"{module_name.lower()}_{table['TableName'].lower()}"
            with open(f"./Program/DB/Models/{table_name}.py", "w+") as model:
                model.write(self.IMPORTS)

                model.write(f"class {table_name}(db):\n")
                model.write(f"\t__tablename__ = '{table_name}'\n")

                # For Each Column in table write to new file
                [self.write_column(column, model) for column in table["Columns"]]

            self.create_table(table_name)

    def create_table(self, tablename):
        """ Generic Function to create table in the database, On successful completion a new Table will be created
        in the database.

        Parameters:
            tablename (str): String Containing the TableName

        Returns:
            None

        """
        __import__(f'Program.DB.Models.{tablename}')
        db.metadata.create_all(engine)

    @staticmethod
    def write_column(column, output):
        # TODO: Create a way to correctly set default values in the db.
        """
        Function to write each column in the table as a complete Column object in a given output file.
        Using the inputs' dictionary to create the correct syntax for all possible table inputs.

        Parameters:
            column (dict): Dictionary containing relevant keys that descibe the relevant table column.
            output (object): Object containing an open .py file to be written to

        Returns:
            None
        """

        inputs = {
            "PrimaryKey": "primary_key=",
            "Nullable": "nullable=",
            "backref": "backref=",
            "default": "default=",
            "ServerDefault": "server_default=",
            "Unique": "unique=",
            "AutoIncrement": "autoincrement=",
            "ForeignKey": "ForeignKey('"
        }

        rowName = column["rowName"]
        rowType = column["Type"]

        column.pop("rowName")
        column.pop("Type")

        row = f"\t{rowName} = Column("
        row += rowType + ", "

        for (col_name, config) in column.items():
            if col_name == "ForeignKey":
                row += f"{inputs[col_name]}{config}', ondelete='CASCADE'), "
            else:
                row += f"{inputs[col_name]}{config}, "

        # Drop the final comma and whitespace and close off function.
        # Move to Newline
        row = row[0:-2] + ")\n"
        output.write(row)


if __name__ == "__main__":
    test_json = "../../Test.json"
    with open(test_json, "r") as model:
        content = model.read()
        module_data = json.loads(content)
        builder(module_data)

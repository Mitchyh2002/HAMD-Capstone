import os


def dir_tree(start_path):
    """
    Re-Usable Function to get the localpaths of all files from a given starting directory.

    Parameters:
        start_path (str): String containing the starting directory to scan all files. This also is the local path.

    Returns:
        dirtree (list): List containing string variables containing the filepath for all files in start_folder.
    """
    dirtree = []
    root, dirs, files = next(os.walk(start_path))
    for dir in dirs:
        to_append = dir_tree(rf"{start_path}\{dir}")
        if to_append != []:
            dirtree = dirtree + to_append
    for file in files:
        dirtree.append(rf"{start_path}\{file}")
    return dirtree


def convert_to_imports(dir_tree):
    """
    Converts a list of filepaths into valid python import directories

    Parameters:
        Parameters:
        start_path (str): list containing filepaths to be converted. if file isn't a .py file it will be ignored.
    Returns:
        imports (list): List containing string variables containing a valid import package.

    """
    imports = []
    for file in dir_tree:
        filename, extension = os.path.splitext(file)
        filename = str(filename)
        if extension == ".py":
            filename = (filename.replace("\\", "."))
            imports.append(filename.replace("/", "."))
    return imports


if __name__ == "__main__":
    ff = convert_to_imports(dir_tree(
        r"/Database Builder (Wk 8)/Program/DB/Models"))
    pass

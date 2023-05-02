import json

def HandleError(error_code, error_message):
    return {"Success": False,
            "StatusCode": error_code,
            "Message": error_message}

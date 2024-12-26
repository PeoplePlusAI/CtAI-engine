from datetime import datetime
def format_timestamp(data):
    # Extract the timestamp
    timestamp_ms = data.get("timestamp")
    if timestamp_ms is None:
        return "Invalid data: No timestamp found"
    
    # Convert milliseconds to seconds for datetime conversion
    timestamp_s = timestamp_ms / 1000
    
    # Convert to a datetime object
    dt_object = datetime.fromtimestamp(timestamp_s)
    
    # Format the datetime object as hh:mm dd/mm/yy
    formatted_time = dt_object.strftime("%d/%m/%y %H:%M ")
    
    return formatted_time
import os

def write_to_datastore(filename, extracted_text, timestamp):
    """
    Write details of a "Cease" request to a datastore (e.g., a flat file or database).
    """
    datastore_path = "static/datastore.txt"
    with open(datastore_path, "a") as f:
        f.write(f"{timestamp} - {filename} - Cease Request\n")
        f.write(f"Extracted Text: {extracted_text}\n\n")

def log_for_audit(filename, extracted_text, classification, timestamp):
    """
    Log the request for audit purposes.
    """
    audit_log_path = "static/audit_log.txt"
    with open(audit_log_path, "a") as f:
        f.write(f"{timestamp} - {filename} - Classification: {classification}\n")
        f.write(f"Extracted Text: {extracted_text}\n\n")

def archive_file(filename, timestamp):
    """
    Archive "Irrelevant" requests by writing details to a flat file.
    """
    archive_path = "static/archive.txt"
    with open(archive_path, "a") as f:
        f.write(f"{timestamp} - {filename} - Archived as Irrelevant\n")
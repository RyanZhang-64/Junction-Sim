import pytest
import logging

#set up global testing (Runs Before Tests)
logging.basicConfig(filename="test_logs.log", level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

@pytest.fixture(autouse=True)
def log_test_start(request):
    """Logs test start and end times."""
    logging.info(f" START: {request.node.name}")
    yield
    logging.info(f" END: {request.node.name}")

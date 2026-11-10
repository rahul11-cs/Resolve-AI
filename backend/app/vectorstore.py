"""
IBM Db2 Vector Store Integration (DB2VS)
Utilizes langchain-db2 and OllamaEmbeddings with cosine distance.
"""
import logging
from typing import List, Tuple, Any
from .config import settings

logger = logging.getLogger("fixrank.vectorstore")

try:
    from langchain_db2 import DB2VS
    from langchain_community.vectorstores.utils import DistanceStrategy
    from langchain_ollama import OllamaEmbeddings
    HAS_DB2VS = True
except ImportError:
    HAS_DB2VS = False
    logger.warning("langchain-db2 or langchain-ollama not available in current runtime.")


def get_vector_store():
    """Initializes and returns the DB2VS instance."""
    if not HAS_DB2VS:
        return None

    embeddings = OllamaEmbeddings(
        model=settings.embed_model,
        base_url=settings.ollama_base_url
    )
    
    connection_string = (
        f"DATABASE={settings.db2_database};"
        f"HOSTNAME={settings.db2_host};"
        f"PORT={settings.db2_port};"
        f"PROTOCOL=TCPIP;"
        f"UID={settings.db2_user};"
        f"PWD={settings.db2_password};"
    )
    
    return DB2VS(
        embedding=embeddings,
        table_name="PROBLEMS",
        connection_string=connection_string,
        distance_strategy=DistanceStrategy.COSINE
    )


def search_problems(query: str, k: int = 10) -> List[Tuple[Any, float]]:
    """Performs cosine vector search in Db2 for matching developer errors."""
    store = get_vector_store()
    if not store:
        return []
    return store.similarity_search_with_score(query, k=k)

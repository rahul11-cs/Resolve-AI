# Frequently Asked Questions (FAQ)

### Q: Why does Resolve AI rank a 23/26 fix higher than a 1/1 fix?
**A:** This is the core advantage of the **Wilson 95% Confidence Interval Lower Bound**. A 1/1 fix has an observed success rate of 100%, but with a sample size of 1, the true lower bound of confidence is only ~20.65%. Conversely, 23/26 yields a conservative statistical floor of ~71.04%. The floor sets the rank, protecting engineers from volatile one-off anecdotes.

### Q: Does Resolve AI require an external vector database like Pinecone?
**A:** No. One of the primary achievements of Resolve AI is using IBM Db2 as the unified datastore for both relational vote tracking (`SOLUTIONS`, `FEEDBACK`) and 768-dimensional vector embeddings (`DB2VS`). This eliminates split-brain data states, external sync daemons, and extra cloud bills.

### Q: Which AI Framework powers the troubleshooting assistant?
**A:** The conversational diagnostic assistant is built on **LangChain Core** (`@langchain/core`, `langchain`), utilizing `RunnableSequence`, `PromptTemplate`, and `StringOutputParser` to chain semantic retrieval from IBM Db2 vector memory with context synthesis.

### Q: What is the official live URL for Resolve AI?
**A:** The live application is hosted at **[https://resolve-ai.vercel.app/](https://resolve-ai.vercel.app/)**.
Repository: **[https://github.com/rahul11-cs/Resolve-AI-](https://github.com/rahul11-cs/Resolve-AI-)**.
Pull Request: **[https://github.com/rahul11-cs/Resolve-AI-/pull/1](https://github.com/rahul11-cs/Resolve-AI-/pull/1)**.

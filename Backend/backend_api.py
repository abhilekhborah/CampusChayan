from flask import Flask, request, jsonify
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from langchain_community.embeddings import VoyageEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.environ["GROQ_API_KEY"]
VOYAGE_API_KEY = os.environ["VOYAGE_API_KEY"]

# Initialize document loading and splitting
loader = TextLoader("/Users/apple/Desktop/CampusChayan/Backend/Document/sih '24 - govt of raj rti handbook v1.0.txt")
documents = loader.load()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=50,
    length_function=len,
    is_separator_regex=False,
)
docs = text_splitter.split_documents(documents)

# Initialize LLM
llm = ChatGroq(
    model="llama-3.1-70b-versatile",
    temperature=0,
    max_tokens=None,
    timeout=None,
    streaming=True,
)

# Define prompt template
prompt_template = """
You are an expert for the Directorate of Technical Education, Rajasthan. Your role is to provide accurate and helpful information about the Directorate's contact details, objectives, and related topics. Please answer the following query based on the given context. After providing your response, translate it into Hindi and suggest three follow-up questions that the user might find relevant.
Query: \n{question}\n
Context: \n{context}\n
Instructions:
1. Answer the query concisely and accurately based on the provided context.
2. When dealing with telephone numbers:
 - Interpret multiple numbers after an area code as different extensions, not separate full numbers.
 - Present phone numbers in a clear, logical format (e.g., "0291-2434395, 2434271" should be interpreted as two extensions for the 0291 area code).
3. Think logically about the information provided and present it in the most sensible way.
4. If the context is unclear or seems illogical, make reasonable assumptions and explain your interpretation.
5. Translate your answer into Hindi.
6. Suggest three relevant follow-up questions.
Your response should be structured as follows:
Answer: [Provide your answer here in English, ensuring logical interpretation of data]
Hindi Translation: [Translate your answer into Hindi]
Recommended Questions: (should be in English)
1. [First follow-up question]
2. [Second follow-up question]
3. [Third follow-up question]
Remember to maintain a professional and informative tone throughout your response. If the query cannot be fully answered based on the given context, acknowledge this and provide the best possible information available, making logical inferences where appropriate.
"""

# Initialize embeddings and vector store
embed = VoyageEmbeddings(model="voyage-large-2-instruct")
vector_db = FAISS.load_local("chayan_db", embed, allow_dangerous_deserialization=True)

# Create prompt and retriever
prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
retriever = vector_db.as_retriever()

# Initialize RetrievalQA chain
chain = RetrievalQA.from_chain_type(
    llm, retriever=retriever, chain_type_kwargs={"prompt": prompt}
)

@app.route('/query', methods=['POST'])
def query_documents():
    data = request.json
    question = data.get('question')
    
    if not question:
        return jsonify({"error": "No question provided"}), 400

    try:
        result = chain({"query": question})
        return jsonify({"result": result["result"]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
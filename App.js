import { useState } from 'react';

const App = () => {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const surpriseOptions = [
        'who won the world cup 2024 in cricket?',
        'who is the world richest man?',
        'who is the world richest woman?',
        'who is the father of cricket?'
    ];

    const surprise = () => {
        const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
        setValue(randomValue);
    };

    const getResponse = async () => {
        if (!value.trim()) {
            setError("Error! Please enter something.");
            return;
        }
        setError(""); // Clear any previous errors

        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    history: chatHistory,
                    message: value,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const response = await fetch('http://localhost:8000/gemini', options);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.text();

            // Ensure parts is an array for both user and model entries
            setChatHistory(oldChatHistory => [
                ...oldChatHistory,
                { role: "user", parts: [value] },
                { role: "model", parts: [data] },
            ]);

            setValue(""); // Clear input after getting response

        } catch (error) {
            console.error(error);
            setError("Something went wrong! Please try again later.");
        }
    };

    const clear = () => {
        setValue("");
        setError("");
        setChatHistory([]); // Clear chat history
    };

    return (
        <div className="app">
            <p>What do you want?
                <button className="surprise" onClick={surprise}>surprise me</button>
            </p>
            <div className="input-container">
                <input
                    value={value}
                    placeholder="Ask me anything"
                    onChange={(e) => setValue(e.target.value)}
                />
                <button onClick={getResponse}>Ask Me</button>
                <button onClick={clear}>Clear</button>
            </div>

            {error && <p className="error">{error}</p>}
            <div className="search-result">
                {chatHistory.map((chatItem, index) => (
                    <div key={index}>
                        <p className={`answer ${chatItem.role}`}>{chatItem.role}: {chatItem.parts}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;


import React, { useState, useEffect, useRef } from 'react';
import { Alert, Button, Typography } from '@material-tailwind/react';
import * as webllm from 'https://esm.run/@mlc-ai/web-llm';
import { Fade } from 'react-awesome-reveal';
import { biographyText, resumeText } from '../constants';

const LumusChat = () => {
  const [openAlert, setOpenAlert] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Qwen2.5-1.5B-Instruct-q4f16_1-MLC');
  const [engine, setEngine] = useState(null);
  const [initStatus, setInitStatus] = useState('Waiting for user input to start LLM model...');
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const initializeWebLLMEngine = async () => {
      const engineInstance = new webllm.MLCEngine();
      engineInstance.setInitProgressCallback((report) => {
        console.log('Initialization progress:', report.progress);
        setInitStatus(report.text); // Update initialization status
      });

      const config = {
        temperature: 0.4,
        context_window_size: 2058,
        max_response_length: 255,
        top_p: 1,
        top_k: 10,
      };

      await engineInstance.reload(selectedModel, config);
      setEngine(engineInstance);
      setInitStatus('Model loaded and ready!');
    };

    if (engine === null) {
      initializeWebLLMEngine();
    }
  }, [selectedModel, engine]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || !engine) return;

    setIsLoading(true);
    const userMessage = { content: input, role: 'user' };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await engine.chat.completions.create({
        messages: [
          {
            content: `
                You are the assitant of Raziel Rodrigues. Your task is to talk about Raziel Rodrigues's biography. Your responses must be strictly based on the following biography: "${biographyText}". If a user asks a question that falls outside of these topics, kindly remind them to keep their inquiry focused on Raziel Rodrigues's biography or resume.

                - **Topic Focus**: Your conversations must strictly revolve around Raziel Rodrigues's biography and resume. Do not deviate from these topics under any circumstances.  
                - **Promotion**: Encourage users to explore Raziel's website, LinkedIn profile, and Dev.to blog for more information.  
                - **Politeness**: Always be polite and respectful to the user.  
                - **Natural Language**: Use natural, conversational language in your responses.  
                - **Professionalism**: Highlight Raziel's skills and experience to showcase him as a highly competent developer and a great team member.  
                - **Calmness**: Maintain a calm and composed demeanor in all interactions.  
                - **Character Limit**: Ensure that your responses do not exceed 255 characters.
          
            `,
            role: 'system',
          },
          ...messages,
          userMessage,
        ],
        stream: false,
      });

      const aiMessage = { content: response.choices[0].message.content, role: 'assistant' };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to fetch AI response:', error);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section className="relative background md:h-full md:w-full sm:h-full sm:w-full  background">
      <div className="grid md:grid-col sm:grid-col h-full w-full place-items-center text-left">
        {/* Left Column */}
        <Fade delay={1e2} cascade damping={1e-1} className="mb-4 text-xl md:text-4xl lg:text-5xl font-bold text-center" triggerOnce>
          Web AI Agent
        </Fade>
        <div className="w-3/4 text-left md:w-3/4">

          <div className="my-2">
            <div className="editor bg-gray-900 p-4 rounded-md text-gray-300 text-wr my-5 text-center">
              <Typography variant="lead" className="opacity-80">
                This is an embedded LLM Model which runs in the client side, utilizing WEB GPU API to run the model,
                this project and other ones are part of my learning journey with Artificial Intelligence.
              </Typography>
            </div>
            <Alert
              open={openAlert}
              className="mx-auto  text-center my-4"
              onClose={() => setOpenAlert(false)}
            >

              <div className="flex gap-3">
                <Typography variant="lead" className="opacity-80 text-center">
                  Be aware this project is still in development and it can reply unlogical answers
                </Typography>
              </div>
            </Alert>
            <div className="editor bg-gray-900 p-4 rounded-md text-gray-300 text-wr">
              <Typography variant="lead" className="opacity-80">
                Step 1: Initialize the LLM model
              </Typography>
              <Typography variant="lead" className="opacity-80">
                Step 2: Ask about my skills, biography, and work experience
              </Typography>
              <Typography variant="lead" className="opacity-80">
                Step 3: How it works? See my article where I cover every detail
              </Typography>
      
            </div>


            
            <div className="editor bg-gray-900 p-4 rounded-md text-gray-300 text-wr my-5">
              <Typography variant="lead" className="opacity-80">
                {initStatus}
              </Typography>
            </div>

            <div className="editor bg-gray-900 p-4 rounded-md text-gray-300 text-wr my-5">
              <select
                disabled
                className="w-full bg-gray-900 text-gray-300 placeholder:text-gray-300 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {webllm.prebuiltAppConfig.model_list.map((model) => (
                  <option key={model.model_id} value={model.model_id}>
                    {model.model_id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-3/4 text-left md:w-3/4">

          <div className="my-2">
            <div
              ref={chatBoxRef}
              className="editor bg-gray-900 p-4 rounded-md text-gray-300 h-80 overflow-y-auto flex flex-col gap-3"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs text-sm ${msg.role === 'user' ? 'bg-gray-800 text-gray-300' : 'bg-gray-800 text-gray-300'
                      }`}
                  >
                    
                    <p className="
                    
                    mb-4 text-normal md:text-normal lg:text-normal font-bold text-left text-gray-300 opacity-80
                    ">{msg.content}</p>
                  </div>
                  
                </div>
              ))}
              {isLoading ? 'Thinking... ' : ''}
            </div>
            <div className="mt-4">
              <textarea
                required
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
                className={`w-full bg-gray-900 text-gray-300 placeholder:text-gray-400 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow resize-none` } 
                name="message"
                rows="3"
                disabled={isLoading}
                placeholder="Type your message..."
              />
            </div>
            <Button
              id='send-button'
              onClick={handleSendMessage}
              className="mt-4 w-full text-gray-300 bg-gray-800 rounded-lg transition duration-300 hover:bg-gray-700"
              style={{
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                border: '1px solid #757575',
              }}
              disabled={isLoading || !engine}
            >
              {isLoading ? 'Thinking...' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LumusChat;
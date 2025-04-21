import { Typography } from "@material-tailwind/react";
import { Fade } from "react-awesome-reveal";
export default function About() {
  return (
    <section className="relative background md:h-full md:w-full sm:h-full sm:w-full  background">
      <div className="grid md:grid-col sm:grid-col h-full w-full place-items-center text-left">
        {/* Left Column */}
        <Fade delay={1e2} cascade damping={1e-1} className="mb-4 text-xl md:text-4xl lg:text-5xl font-bold text-center" triggerOnce>
          Sobre
        </Fade>
        <div className="w-3/4 text-left md:w-3/4">

          <div className="my-2">
            <div className="editor bg-gray-900 p-4 rounded-md text-gray-300 text-wr my-5 text-center">
              <Typography variant="lead" className="opacity-80">
                This is an embedded LLM Model which runs in the client side, utilizing WEB GPU API to run the model,
                this project and other ones are part of my learning journey with Artificial Intelligence.
              </Typography>
            </div>
          
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


         
 
          </div>
        </div>
 
      </div>
    </section>
  )
}

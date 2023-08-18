import Persona, { Client, ClientOptions } from "persona";
import { createContext, ReactNode, Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react';

function App() {
  const [openPersona, setOpenPersona] = useState(false);
  const [openPersonaInquiry, setOpenPersonaInquiry] = useState(false);

  const [personaTime, setPersonaTime] = useState(Date.now());
  const [personaInquiryTime, setPersonaInquiryTime] = useState(Date.now());

  const changePersona = () => {
    setOpenPersona(!openPersona);
  };

  const changePersonaInquiry = () => {
    setOpenPersonaInquiry(!openPersonaInquiry);
  };

  const personaPhotoConfig = PersonaPhotoClientConfiguration({
    onLoad: () => { setPersonaTime(Date.now()); },
    onReady: () => { console.log(`PersonaLoader: ${Date.now() - personaTime}`); }
  });

  return (
    <>
      {
        // Example using new PersonaLoader + PersonaClient in this file
      }
      <PersonaLoader referenceId='userId' clientsToLoad={[personaPhotoConfig]}>
        {openPersona &&
          <PersonaClient templateId={PersonaPhotoClientOptions.templateId!} />
        }
        <button onClick={changePersona}>Open Persona</button>
      </PersonaLoader>

      {
        // Example showing the current "react component" that comes in persona for Persona.Inquiry
      }

      <button onClick={changePersonaInquiry}>Change Persona Inquiry</button>
      {openPersonaInquiry && 
        <Persona.Inquiry
          templateId='itmpl_tkLpndZBXR7szCkPQmDJ9AEW'
          referenceId='userId'
          environment='sandbox'
          onLoad={() => setPersonaInquiryTime(Date.now())}
          onReady={() => {console.log(`Inquiry: ${Date.now() - personaInquiryTime}`)}}
        />}
    </>
  );
}

const PersonaPhotoClientOptions: ClientOptions = {
  templateId: 'itmpl_tkLpndZBXR7szCkPQmDJ9AEW',
  environment: 'sandbox',
}

const PersonaPhotoClientConfiguration = (options: ClientOptions): ClientOptions => ({
  ...options,
  ...PersonaPhotoClientOptions
});

type PersonaLoaderProps = {
  clientsToLoad: ClientOptions[];
  referenceId: string;
  children: ReactNode;
};

const PersonaContext = createContext<{ templates: Map<string, Client> }>({ templates: new Map() });

export const usePersonaContext = () => {
  return useContext(PersonaContext);
}

const PersonaLoader = ({
  clientsToLoad,
  referenceId,
  children
}: PersonaLoaderProps) => {
  const templates = useRef(new Map());
  
  useEffect(() => {
    templates.current = new Map(clientsToLoad.map(options => {
      const client = new Persona.Client({
        referenceId,
        ...options
      });
    
      client.render();      
      return [
        options.templateId!,
        client
      ]
      }))
  }, []);
  
  return (
    <PersonaContext.Provider value={{templates: templates.current}}>
      {children}
    </PersonaContext.Provider>
  );
}

type PersonaClientProps = {
  templateId: string,
};

const PersonaClient = ({
  templateId
}: PersonaClientProps) => {
  const personaContext = usePersonaContext();
  const client = personaContext.templates.get(templateId);

  client?.open();

  return <></>;
}

export default App;

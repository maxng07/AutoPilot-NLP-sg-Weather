# AutoPilot-NLP-sg-Weather
Twilio AutoPilot NLP for SG Weather Forecast
This is an Add-on to the SG Weather Forecast Application (https://github.com/maxng07/sg-WhatsApp-Weather-DirectAPI), adding Natural Language Processing using Twilio AutoPilot (TA). With TA, this will front all communication channel requests, TA will have a logic to prompt user with questions and then send the appropriate request to backend application function to extract the weather forecast data. The same Weather Forecast function logic is used with some minor changes to the code.

 Communication Channels ----------------- Twilio AutoPilot ------------- Weather App ------------ NEA API GW
(Voice/WhatsApp/SMS/Google Assisant)							  (Jarvis)                    (Serverless)


The Twilio AutoPilot profile is codename JARVIS and the config is in config.json. It is broken down into several tasks. You will need a Twilio Account to import the config using TA-Autopilot CLI.
These are the tasks
1. Hello /Hello.json - Greets the user coming from various communication channels
2. Weather /Weather.json - Prompts the User for Weather forecast with questions to construct a query to backend, error handling
3. having-trouble - to close the conversation when an error is encounter. Specifically meant for Voice channel when NLP could not interpret.
4. End-conversation - to close the conversation when user respond negative to having weather forecast

The backend weather forecast autopilot-weather.js logic running on Twilio Function have these minor modications
1. Change input field value from event.Body to event.CurrentInput this contains the field value of "Area" or "All" for use to query weather forecast retrieve from NEA website.

const Body = event.CurrentInput is now used
2. Variable key is now change to converting "Body" to lowercase for matching the array fetch from NEA.
var key = Body.toLowerCase();
3. Added a new variable "message", this is use to construct the response back for TA


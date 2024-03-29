# NLP-sg-Weather-using-AutoPilot
Natural Language Processing with capabilities to support incoming Voice, Google Assistant, WhatsApp, SMS with a Chatbot responder for Singapore Weather Forecast. The weather data are extracted from NEA/Gov Tech. <br>

Twilio AutoPilot NLP for SG Weather Forecast. <br>
Twilio AutoPilot and Amazon Lex looks very similar with almost the same feature sets and pricing, it is not known if they are similar, but Twilio AutoPilot is much simpler to configure.

This is an Add-on to the SG Weather Forecast Application (https://github.com/maxng07/sg-WhatsApp-Weather-DirectAPI), adding Natural Language Processing using Twilio AutoPilot (TA). With TA, this will front all communication channel requests (be it WhatsApp, Google Assistant or Voice on either SIP or WebRTC), TA will have a logic to prompt user with questions and then send the appropriate request to the backend application running on Twilio Serverless function to extract the weather forecast data. The same Weather Forecast function logic in the original Weather app is used with some minor changes to the code to get it working with TA. More details below.

 Communication Channels ----------------- Twilio AutoPilot ------------- Weather App ------------ NEA API GW
(Voice/WhatsApp/SMS/Google Assisant)-------(Jarvis)------------------(Serverless)


The Twilio AutoPilot profile is codename JARVIS and the full backup config is in folder "AutoPilot Config". It is broken down into several tasks. The config of each task is in main folder ending with .json. You will need a Twilio Account and TA-Autopilot CLI to import the full backup config. Otherwise you can create the config for task manually with the individual task config. <br>

These are the tasks at high-level 
1. Hello /Hello.json - Greets the user coming from various communication channels (Google Assistant, WhatsApp, SMS and Voice)
2. Weather /Weather.json - Prompts the User for Weather forecast with questions to construct a query to backend with error handling
3. Having-trouble - to close the conversation when an error is encounter. Specifically meant for Voice channel when NLP could not interpret.
4. End-conversation - to close the conversation when user respond negative to having weather forecast

The backend weather forecast autopilot-weather.js logic running on Twilio Function have these minor modications to work with TA.
1. Change input field value from event.Body to event.CurrentInput. CurrentInput is a param send out from TA in a regular HTTPS POST message. CurrentInput contains user's input either from speech or text. Although the NLP has the "Weather" task with questions to prompt user for Town-Area, it is possible a user will either speak or type a sentence, example "I like to know the weather in Novena". CurrentInput param will contain this. The field/keyword value is contained within an array that TA also send in a JSON array format by the name of Memory. Extracting the field/keyword value from Memory array would be more accurate for matching. 
<br>
const Body = event.CurrentInput is now used or from the memory table 
If you use Twilio Serverless/Function for your backend, Twilio AutoPilot will pass field variable in parameter as part of HTTPS POST, you can extract this either via <br>
(a) event.CurrentInput <br>
(b) event.Field_{Name of your field in TA}_Value (there seems to be an odd bug that this param is not present. Have send a note to Twilio <br>
(c) Array by the name of Memory - extract the data from the array. The exact key memory.twilio.collected_data.ask_area.answers.Area.answer <br>

2. Variable key is now change to converting "Body" to lowercase for matching the array fetch from NEA.
var key = Body.toLowerCase();

3. Added a new variable "message", this is use to construct the response back for TA

This has been tested with Voice (Webrtc), WhatsApp and Google Assistant integrating with TA. 


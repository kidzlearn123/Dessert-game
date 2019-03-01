/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

var Alexa = require('alexa-sdk');

var states = {
    STARTMODE: '_STARTMODE',                // Prompt the user to start or restart the game.
    ASKMODE: '_ASKMODE',                    // Alexa is asking user the questions.
    DESCRIPTIONMODE: '_DESCRIPTIONMODE'     // Alexa is describing the final choice and prompting to start again or quit
};


//This is a list of positive speechcons that this skill will use when a user gets a correct answer.  For a full list of supported
//speechcons, go here: https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/speechcon-reference
var speechConsCorrect = ["All righty","Ok","Good choice","Great going","Yummy","Cheers","Dynomite","Great choice","Doing good","Cool","Righto","Whee","Woo hoo","Yay","Wowza"];


const aud = {

    "intro": "https://s3.amazonaws.com/asksounds/happyintro.mp3",
   "resp": "https://s3.amazonaws.com/asksounds/correct1.mp3",
   "corr": "https://s3.amazonaws.com/funnyspeech/huzzah.mp3",
   "argh": "https://s3.amazonaws.com/funnyspeech/argh.mp3",
   "bum": "https://s3.amazonaws.com/funnyspeech/bummer.mp3",
   };

var languageStrings = {
    'en-IN': {
        'translation': {
            'SKILL_GREETING' : 'Namaste',
            'SKILL_NAME': "What's your Dessert",
        }
    },
    'en-GB': {
        'translation': {
            'SKILL_GREETING' : 'Hi there',
            'SKILL_NAME': "What's your Dessert",
        }
    },
    'en-US': {
        'translation': {
            'SKILL_GREETING' : 'Hello',
            'SKILL_NAME': "What's your Dessert",
        }
    },
    'de-DE': {
        'translation': {
            'SKILL_GREETING' : 'Hallo',
            'SKILL_NAME': "What's your Dessert",
        }
    }
};

// Questions
var nodes = [{ "node": 1, "message": "<prosody rate='90%' volume='x-soft' /> Do you like lots of Cheese in your dessert", "yes": 5 , "no": 2 },
             { "node": 2, "message": "<prosody rate='90%' volume='x-soft' /> Do you like blueberries in your dessert ?", "yes":3 , "no": 4 },
             { "node": 3, "message": "<prosody rate='90%' volume='x-soft' /> Do you like a colorful dessert ?", "yes": 10, "no": 16 },
             { "node": 4, "message": "<prosody rate='90%' volume='x-soft' /> Do you like chocolate in your dessert?", "yes": 22, "no": 23 },
             { "node": 5, "message": "<prosody rate='90%' volume='x-soft' /> Do you like cakes ?", "yes": 9, "no": 6 },
             { "node": 6, "message": "<prosody rate='90%' volume='x-soft' /> Do you like apples in your dessert?", "yes": 7, "no": 20 },
             { "node": 7, "message": "<prosody rate='90%' volume='x-soft' /> Do you like a pie for dessert ?", "yes": 11, "no": 21 },
             { "node": 9, "message": "<prosody rate='90%' volume='x-soft' /> Do you like a warm dessert ?", "yes": 36, "no": 14 },
             { "node": 10, "message": "<prosody rate='90%' volume='x-soft' /> Do you like a see through dessert ?", "yes": 15, "no": 13 },
             { "node": 22, "message": "<prosody rate='90%' volume='x-soft' /> Is your teeth sensitive ?", "yes": 18, "no": 17 },
             { "node": 23, "message": "<prosody rate='90%' volume='x-soft' /> Do you like a fruit in your dessert ?", "yes": 25, "no": 26 },
             { "node": 26, "message": "<prosody rate='90%' volume='x-soft' /> Do you like some Oat's in your dessert ?", "yes": 12, "no": 27 },
             { "node": 36, "message": "<prosody rate='90%' volume='x-soft' /> Do you like Carrots in your dessert ?", "yes": 28, "no": 19 },

// Answers & descriptions
             { "node": 11, "message": "<prosody rate='90%' volume='x-soft' />  Your dessert is Apple Pie with Cheese topping", "yes": 0, "no": 0, "description": "<prosody rate='90%' volume='x-soft' /> Apple pie with cheese is a comfort food and awesome. You work hard but like to relax and have fun." },
             { "node": 12, "message": "<prosody rate='90%' volume='x-soft' />  Your dessert is Oatmeal Cookies.", "yes": 0, "no": 0, "description": "<prosody rate='90%' volume='x-soft' /> Oatmeal is very healthy. April 30th is National Oatmeal Cookie Day. You are a health freak."},
             { "node": 13, "message": "<prosody rate='90%' volume='x-soft' />  Your dessert is a Blueberry muffin", "yes": 0, "no": 0 , "description": "<prosody rate='90%' volume='x-soft' /> Blueberry muffin was sold as a tea time snack in London streets by muffin men. You are an outside person and like to travel."},
             { "node": 14, "message": "<prosody rate='90%' volume='x-soft' />  Your dessert is Cheese Cake.", "yes": 0, "no": 0 , "description": "<prosody rate='90%' volume='x-soft' /> Cheese cakes first originated in Greece and were served to athletes in Olympics. Maybe, you are a sports person or a big sports fan."},
             { "node": 15, "message": "<prosody rate='90%' volume='x-soft' />  Your dessert is Blueberry Jell-O.", "yes": 0, "no": 0 , "description": "<prosody rate='90%' volume='x-soft' /> Blueberry Jell-O is not a great source of vitamins or minerals. You seem to like eating junk food."},
             { "node": 16, "message": "<prosody rate='90%' volume='x-soft' />  You just like to eat Blueberries for dessert.", "yes": 0, "no": 0 , "description": "<prosody rate='90%' volume='x-soft' /> While blueberries are yummy, they leave blue stains on fingers, face and clothes. You like to be little bit messy but clean up later in your life."},
             { "node": 17, "message": "<prosody rate='90%' volume='x-soft' />  Your dessert is Chocolate Ice cream.", "yes": 0, "no": 0 , "description": "<prosody rate='90%' volume='x-soft' /> It takes about 50 licks to lick away one scoop of ice cream! July is national ice cream month. You like to do cool things on hot days. "},
             { "node": 18, "message": "<prosody rate='90%' volume='x-soft' />  Your dessert is Chocolate Milkshake", "yes": 0, "no": 0 , "description": "<prosody rate='90%' volume='x-soft' /> Consuming a serving of chocolate milkshake will do a great job of satisfying your hunger. You like to eat, drink and have fun."},
             { "node": 19, "message": "<prosody rate='90%' volume='x-soft' />  Your dessert is Cheese Blintzes cake.", "yes": 0, "no": 0 , "description": "<prosody rate='90%' volume='x-soft' /> Cheese Blintzes are a party favorite. You are a party animal."},
             { "node": 20, "message": "<prosody rate='90%' volume='x-soft' />  You just like to eat cheese for dessert.", "yes": 0, "no": 0 , "description": "<prosody rate='90%' volume='x-soft' /> It takes around 10 litres of milk to make 1 kilogram of hard cheese. You work really hard to get things done."},
             { "node": 21, "message": "<prosody rate='90%' volume='x-soft' />  You like to eat grilled apple with cheese honey for dessert.", "yes": 0, "no": 0 , "description": "<prosody rate='90%' volume='x-soft' /> This is a simple, healthy and a quick dessert. You like simple but elegant things in life."},
             { "node": 25, "message": "<prosody rate='90%' volume='x-soft' />  Your dessert is Apple Pie", "yes": 0, "no": 0, "description": "<prosody rate='90%' volume='x-soft' /> Apple pie is simple and a comfort food. You like to relax and have fun." },
             { "node": 27, "message": "<prosody rate='90%' volume='x-soft' />  Your desert is Rice Pudding", "yes": 0, "no": 0, "description": "<prosody rate='90%' volume='x-soft' /> Rice Pudding is simple and popular, but a heavy food. August 9th is Rice Pudding day. You like to relax, have fun and earn fame by being simple." },
             { "node": 28, "message": "<prosody rate='90%' volume='x-soft' />  Your desert is Warm Carrot Cake", "yes": 0, "no": 0, "description": "<prosody rate='90%' volume='x-soft' /> Carrots are a root vegetable that originated in Afghanistan. February 3rd is National Carrot Cake Day. You are a joyful, enthusiastic and non agressive person." },


];

// this is used for keep track of visted nodes when we test for loops in the tree
var visited;

// These are messages that Alexa says to the user during conversation

// This is the intial welcome message
var welcomeMessage = "<audio src='" + aud['intro'] + "' /><prosody rate='95%' volume='x-soft'>Welcome to What\'s my dessert game, are you ready to play? </prosody>";

// This is the message that is repeated if the response to the initial welcome message is not heard
var repeatWelcomeMessage = "<audio src='" + aud['intro'] + "' /><prosody rate='95%' volume='x-soft'>Say yes to start the game or no to quit.</prosody>";

// this is the message that is repeated if Alexa does not hear/understand the reponse to the welcome message
var promptToStartMessage = "<audio src='" + aud['resp'] + "' /><prosody rate='95%' volume='x-soft'> Welcome to What\'s my dessert game, are you ready to play ? Say yes to continue, or no to end the game.</prosody>";

// This is the prompt during the game when Alexa doesnt hear or understand a yes / no reply
var promptToSayYesNo = "<audio src='" + aud['argh'] + "' /><prosody rate='95%' volume='x-soft'> I can only understand yes or no to continue the game. Please say 'yes' or 'no' and definitely not 'may be' or 'I do not know' for an answer.</prosody>";

// This is the response to the user after the final question when Alex decides on what group choice the user should be given
var decisionMessage = "I think";

// This is the prompt to ask the user if they would like to hear a short description of thier chosen profession or to play again
var playAgainMessage = "<say-as interpret-as='interjection'><audio src='" + aud['corr'] + "' /> </say-as><break strength='strong'/><prosody rate='95%' volume='x-soft'> Say 'about' to hear a short description for this dessert, or do you want to play again? </prosody>";

// this is the help message during the setup at the beginning of the game
var helpMessage = "<audio src='" + aud['intro'] + "' /><prosody rate='95%' volume='x-soft'> I will ask some questions and predict your favorite dessert, and say a fun fact about the dessert, and also, you. Want to start now? </prosody>" ;

// This is the goodbye message when the user has asked to quit the game
var goodbyeMessage = "<audio src='" + aud['bum'] + "' /> Ok, see you next time! Check out <say-as interpret-as='spell-out'>www.</say-as>kidzlearn<say-as interpret-as='spell-out'>.co</say-as> <break time='0.5s'/>with a z in kidz for more educational products.";

var speechNotFoundMessage = "<audio src='" + aud['argh'] + "' /><prosody rate='95%' volume='x-soft'><say-as interpret-as='interjection'> You can only say 'yes' or 'no' to play this game</prosody></say-as><break strength='strong'/>";

var nodeNotFoundMessage = "<audio src='" + aud['bum'] + "' /> I cannot predict if you say anything other than 'yes' or 'no'. Why don't we try playing this game again.";

var descriptionNotFoundMessage = "<audio src='" + aud['argh'] + "' /> Cannot answer as something went wrong. Let's play again.";

var loopsDetectedMessage = "<audio src='" + aud['argh'] + "' /> You repeated the answer, please, say only 'yes' or 'no' to continue this game";

var utteranceTellMeMore = " tell me more";

var utterancePlayAgain =  "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>" + "<audio src='" + aud['corr'] + "' /><prosody rate='90%' volume='x-soft'> play again? </prosody>";

// the first node that we will use
var START_NODE = 1;

// --------------- Handlers -----------------------

// Called when the session starts.
exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(newSessionHandler, startGameHandlers, askQuestionHandlers, descriptionHandlers);
    alexa.execute();
};

// set state to start up and  welcome the user
var newSessionHandler = {
  'LaunchRequest': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', welcomeMessage);
  },'AMAZON.HelpIntent': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', helpMessage);
  },
  'Unhandled': function () {
    this.handler.state = states.STARTMODE;
    this.emit(':ask', promptToStartMessage);
  }
};

// --------------- Functions that control the skill's behavior -----------------------

// Called at the start of the game, picks and asks first question for the user
var startGameHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
    'AMAZON.YesIntent': function () {

        // ---------------------------------------------------------------
        // check to see if there are any loops in the node tree - this section can be removed in production code
        visited = [nodes.length];
        var loopFound = helper.debugFunction_walkNode(START_NODE);
        if( loopFound === true)
        {
            // comment out this line if you know that there are no loops in your decision tree
             this.emit(':tell', loopsDetectedMessage);
        }
        // ---------------------------------------------------------------

        // set state to asking questions
        this.handler.state = states.ASKMODE;

        // ask first question, the response will be handled in the askQuestionHandler
        var message = "<prosody rate='90%' volume='x-soft' />" + helper.getSpeechForNode(START_NODE);

        // record the node we are on
        this.attributes.currentNode = START_NODE;

        // ask the first question
        this.emit(':ask', message, message);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
         this.emit(':ask', promptToStartMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', helpMessage, helpMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToStartMessage);
    }
});


// user will have been asked a question when this intent is called. We want to look at their yes/no
// response and then ask another question. If we have asked more than the requested number of questions Alexa will
// make a choice, inform the user and then ask if they want to play again
var askQuestionHandlers = Alexa.CreateStateHandler(states.ASKMODE, {

    'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        helper.yesOrNo(this,'yes');
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
         helper.yesOrNo(this, 'no');
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage);
    },
    'Unhandled': function () {
        this.emit(':ask', promptToSayYesNo);
    }
});

// user has heard the final choice and has been asked if they want to hear the description or to play again
var descriptionHandlers = Alexa.CreateStateHandler(states.DESCRIPTIONMODE, {

 'AMAZON.YesIntent': function () {
        // Handle Yes intent.
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage);
    },
    'AMAZON.NoIntent': function () {
        // Handle No intent.
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', promptToSayYesNo, promptToSayYesNo);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', goodbyeMessage);
    },
    'AMAZON.StartOverIntent': function () {
        // reset the game state to start mode
        this.handler.state = states.STARTMODE;
        this.emit(':ask', welcomeMessage);
    },
    'DescriptionIntent': function () {
        //var reply = this.event.request.intent.slots.Description.value;
        //console.log('HEARD: ' + reply);
        helper.giveDescription(this);
      },

    'Unhandled': function () {
        this.emit(':ask', promptToSayYesNo);
    }
});

    function getRandom(min, max) {
    return Math.floor(Math.random() * (max-min+1)+min);
}
// --------------- Helper Functions  -----------------------

var helper = {

    // gives the user more information on their final choice
    giveDescription: function (context) {

        // get the speech for the child node
        var description = helper.getDescriptionForNode(context.attributes.currentNode);
      var message = description + ', ' + repeatWelcomeMessage;

        context.emit(':ask', message, message);
    },

    // logic to provide the responses to the yes or no responses to the main questions
    yesOrNo: function (context, reply) {

        // this is a question node so we need to see if the user picked yes or no
        var nextNodeId = helper.getNextNode(context.attributes.currentNode, reply);

        // error in node data
        if (nextNodeId == -1)
        {
            context.handler.state = states.STARTMODE;

            // the current node was not found in the nodes array
            // this is due to the current node in the nodes array having a yes / no node id for a node that does not exist
            context.emit(':tell', nodeNotFoundMessage, nodeNotFoundMessage);
        }

        // get the speech for the child node
        var message = "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>" + helper.getSpeechForNode(nextNodeId);
        var message1 = helper.getSpeechForNode(nextNodeId);

        // have we made a decision
        if (helper.isAnswerNode(nextNodeId) === true) {

            // set the game state to description mode
            context.handler.state = states.DESCRIPTIONMODE;

            // append the play again prompt to the decision and speak it
            message = "<say-as interpret-as='interjection'>" + speechConsCorrect[getRandom(0, speechConsCorrect.length-1)] + "! </say-as><break strength='strong'/>" + decisionMessage + ' ' + message1 + ' ,' + playAgainMessage;
        }

        // set the current node to next node we want to go to
        context.attributes.currentNode = nextNodeId;

        context.emit(':ask', message, message);
    },


    // gets the description for the given node id
    getDescriptionForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].description;
            }
        }
        return descriptionNotFoundMessage + nodeId;
    },

    // returns the speech for the provided node id
    getSpeechForNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                return nodes[i].message;
            }
        }
        return speechNotFoundMessage + nodeId;
    },

    // checks to see if this node is an choice node or a decision node
    isAnswerNode: function (nodeId) {

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (nodes[i].yes === 0 && nodes[i].no === 0) {
                    return true;
                }
            }
        }
        return false;
    },

    // gets the next node to traverse to based on the yes no response
    getNextNode: function (nodeId, yesNo) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].node == nodeId) {
                if (yesNo == "yes") {
                    return nodes[i].yes;
                }
                return nodes[i].no;
            }
        }
        // error condition, didnt find a matching node id. Cause will be a yes / no entry in the array but with no corrosponding array entry
        return -1;
    },

    // Recursively walks the node tree looking for nodes already visited
    // This method could be changed if you want to implement another type of checking mechanism
    // This should be run on debug builds only not production
    // returns false if node tree path does not contain any previously visited nodes, true if it finds one
    debugFunction_walkNode: function (nodeId) {

        // console.log("Walking node: " + nodeId);

        if( helper.isAnswerNode(nodeId) === true) {
            // found an answer node - this path to this node does not contain a previously visted node
            // so we will return without recursing further

            // console.log("Answer node found");
             return false;
        }

        // mark this question node as visited
        if( helper.debugFunction_AddToVisited(nodeId) === false)
        {
            // node was not added to the visited list as it already exists, this indicates a duplicate path in the tree
            return true;
        }

        // console.log("Recursing yes path");
        var yesNode = helper.getNextNode(nodeId, "yes");
        var duplicatePathHit = helper.debugFunction_walkNode(yesNode);

        if( duplicatePathHit === true){
            return true;
        }

        // console.log("Recursing no");
        var noNode = helper.getNextNode(nodeId, "no");
        duplicatePathHit = helper.debugFunction_walkNode(noNode);

        if( duplicatePathHit === true){
            return true;
        }

        // the paths below this node returned no duplicates
        return false;
    },

    // checks to see if this node has previously been visited
    // if it has it will be set to 1 in the array and we return false (exists)
    // if it hasnt we set it to 1 and return true (added)
    debugFunction_AddToVisited: function (nodeId) {

        if (visited[nodeId] === 1) {
            // node previously added - duplicate exists
            // console.log("Node was previously visited - duplicate detected");
            return false;
        }

        // was not found so add it as a visited node
        visited[nodeId] = 1;
        return true;
    }
};

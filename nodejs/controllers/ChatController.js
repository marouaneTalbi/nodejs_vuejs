const User = require('../models/userModel')
const Chat = require('../models/chatModel');
//const UserGame = require("../models/userGameModel");
//const Game = require("../models/gameModel");

let chatMessages = [];

// Function to add a chat message
const addChatMessage = (message) => {
    chatMessages.push(message);
};

// Function to get all chat messages
const getChatMessages = () => {
    return chatMessages;
};

module.exports = {
    addChatMessage,
    getChatMessages,
};

exports.createChat = async(req, res) => {
    console.log("test")
    try {

        const chat = await chat.create({
            user_id: userId,
            content: content,
        });

        if(!chat) {
            return res.status(404).json({message: 'chat does not exit'})
        }

        return res.status(200).json(chat);

    } catch(error) {
        console.error(error);
        //throw error;
        return res.status(500).json({message: 'error server'})
    }
}

exports.updateReport = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chatInstance = await chat.findByPk(chatId);

        if (!chatInstance) {
            return res.status(404).json({ message: 'Le chat n\'existe pas' });
        }

        // Faites les mises à jour nécessaires sur l'instance de chat ici
        // const updatedData = { ... } ;
        // await chatInstance.update(updatedData);

        // Répondez à la requête avec les informations mises à jour
        return res.status(200).json({ message: 'Mise à jour du chat réussie', chat: chatInstance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur lors de la mise à jour du chat' });
    }
};

//exports.updateReport = async(chatId, updatedData) => {
/*exports.updateReport = async(req, res) => {

    console.log(req.params)

        try {
            const chat = await chat.findByPk(chatId);

            if (!chat) {
                return res.status(404).json({ message: 'Le chat n\'existe pas' })
            }

            await chat.update(updatedData);


            return chat;

        } catch (error) {
            return 'Erreur lors de la mise à jour du chat' ;
        }
    }
}*/
const path = require('path');
const Skin = require('../../models/skin/SkinModel');
const User = require('../../models/userModel');
const stripe = require('stripe')('sk_test_51IM8ZrEwRtoFpDAHRzosyjI15p26BORIEDgbmAyTU6vftlVeTcKt3ncppiL7SPkqlOcKYsH3sdHfo41hvqrgBb4G00hRY1LExZ');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
var base64ToImage = require('base64-to-image');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const serverURI = process.env.SERVER_URI;

exports.getAllSkins = async (req, res) => {
  try {
    const skins = await Skin.findAll();
    skins.forEach((skin) => {
      skin.picture = path.join('/pictures/skins/', skin.picture);
    });
    res.json(skins);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération des skins:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des skins' });
  }
};

exports.getSkinById = async (req, res) => {
  const skinId = req.params.id;
  try {
    const skin = await Skin.findByPk(skinId);
    if (skin) {
      res.json(skin);
    } else {
      res.status(404).json({ message: 'Skin non trouvé' });
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la récupération du skin:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération du skin' });
  }
};


function saveSkinImage(imageTitle, imageData) {
  const fileName = uuidv4()+ '_' +imageTitle
  const imageType = 'png';

  const imagePath = path.join(__dirname, '../../pictures/skins/');
  var optionalObj = {fileName: fileName, 'type':imageType};
  base64ToImage(imageData, imagePath, optionalObj); 
  return fileName+'.'+imageType;
}

exports.createSkin = async (req, res) => {
  const { title, price, picture, money_type, coins_price} = req.body;
  const pictureName =  saveSkinImage(title, picture)

  try {
    const newSkin = await Skin.create({ title, price, picture:pictureName, money_type, coins_price});

    res.status(201).json(newSkin);
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la création du skin:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la création du skin' });
  }
};

exports.updateSkin = async (req, res) => {
  const skinId = req.params.id;
  const { title, price, picture, money_type, coins_price } = req.body;
  try {
    const skin = await Skin.findByPk(skinId);
    if (skin) {
      if(picture) {
        const pictureName =  saveSkinImage(title, picture)
        await skin.update({ title, price,  picture:pictureName, money_type, coins_price });
      } else {
        await skin.update({ title, price,  money_type, coins_price });
      }
      res.json(skin);
    } else {
      res.status(404).json({ message: 'Skin non trouvé' });
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la mise à jour du skin:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la mise à jour du skin' });
  }
};

// Méthode pour supprimer un skin
exports.deleteSkin = async (req, res) => {
  const skinId = req.params.id;
  try {
    const skin = await Skin.findByPk(skinId);
    if (skin) {
      await skin.destroy();
      res.json({ message: 'Skin supprimé avec succès' });
    } else {
      res.status(404).json({ message: 'Skin non trouvé' });
    }
  } catch (error) {
    console.error('Une erreur s\'est produite lors de la suppression du skin:', error);
    res.status(500).json({ message: 'Une erreur s\'est produite lors de la suppression du skin' });
  }
};

exports.purchaseSkin = async (req, res) => {
  
    const userId = req.body.userId;
    const skinId = req.body.skinId;
    console.log(userId, skinId)
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      const skin = await Skin.findByPk(skinId);
      if (!skin) {
        return res.status(404).json({ message: 'Skin non trouvé' });
      }

        user.skins_fk_id = skinId;
        user.addSkin(skin)
        await user.save();
      res.json({ message: 'Skin acheté avec succès', skin: skin });
    } catch (error) {
      console.error('Une erreur s\'est produite lors de l\'achat du skin:', error);
      res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'achat du skin' });
    }
  };
  
  exports.assignSkinToUser = async (req, res) => {
    const userId = req.body.userId;
    const skinId = req.body.skinId;

    try {
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      const skin = await Skin.findByPk (skinId);

      if (!skin) {
        return res.status(404).json({ message: 'Skin non trouvé' });
      }
  
      user.skins_fk_id = skinId;

      await user.save();
  
      res.json({ message: 'Skin affecté à l\'utilisateur avec succès', skin: skin });
    } catch (error) {
      console.error('Une erreur s\'est produite lors de l\'affectation du skin à l\'utilisateur:', error);
      res.status(500).json({ message: 'Une erreur s\'est produite lors de l\'affectation du skin à l\'utilisateur' });
    }
  };


  exports.paySkin =  async (req, res) => {
    const  {skin}  = req.body;
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: skin.title, 

              },
              unit_amount: skin.price * 100,
            },
            quantity: 1, // Quantité de produits
          },
        ],
        mode: 'payment',
        success_url: `${serverURI}/skins_to_buy`, // URL de succès du paiement
        cancel_url: `${serverURI}/skins`, // URL d'annulation du paiement
      });
      res.json({ sessionId: session.id });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

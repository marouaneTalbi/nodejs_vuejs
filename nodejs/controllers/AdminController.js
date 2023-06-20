exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Une erreur s\'est produite lors de la récupération des utilisateurs' });
    }
  };
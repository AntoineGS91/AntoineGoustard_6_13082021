// Import du model Sauce
const Sauce = require('../models/Sauce')
const fs = require('fs');

// Récupération de la liste des sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
}

// Récupération de la sauce sélectionnée
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}

// Création d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
    .catch(error => res.status(400).json({ error }));
}

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  let sauceObject = {};
  req.file ? (
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      // Suppression de l'image existante
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {
      // Ajout de la nouvelle image
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    }
  ) : (sauceObject = {...req.body})
  // Utilisation des nouvelles propriétés pour modifier la sauce
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }, { runValidators: true })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
}

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
}

// Like / Dislike d'une sauce
exports.likeSauce = (req, res, next) => {
  let like = req.body.like
  let userId = req.body.userId
  let sauceId = req.params.id

  if (like === 1) {
    // Si on like la sauce
    Sauce.updateOne({_id: sauceId},{$push: {usersLiked: userId}, $inc: {likes: +1}})
      .then(() => res.status(200).json({message: 'like ajouté !'}))
      .catch((error) => res.status(400).json({error}))
  }
  if (like === -1) {
    // Si on dislike la sauce
    Sauce.updateOne({_id: sauceId}, {$push: {usersDisliked: userId},$inc: {dislikes: +1}})
      .then(() => res.status(200).json({message: 'Dislike ajouté !'}))
      .catch((error) => res.status(400).json({error}))
  }
  if (like === 0) {
    // Si like / dislike retiré
    Sauce.findOne({_id: sauceId})
      .then((sauce) => {
        if (sauce.usersLiked.includes(userId)) {
          Sauce.updateOne({_id: sauceId}, {$pull: {usersLiked: userId},$inc: {likes: -1}})
            .then(() => res.status(200).json({message: 'Like retiré !'}))
            .catch((error) => res.status(400).json({error}))
        }
        if (sauce.usersDisliked.includes(userId)) {
          Sauce.updateOne({_id: sauceId}, {$pull: {usersDisliked: userId},$inc: {dislikes: -1}})
            .then(() => res.status(200).json({message: 'Dislike retiré !'}))
            .catch((error) => res.status(400).json({error}))
        }
      })
      .catch((error) => res.status(404).json({error}))
  }
}
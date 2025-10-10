// src/pages/Legal.jsx
import { motion } from "framer-motion";

export default function Legal() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Bandeau d’en-tête premium */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-20 left-0 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full" />
        <div className="h-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600" />
        <div className="relative text-center py-20 px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900"
          >
            Mentions légales
          </motion.h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Informations légales concernant l’éditeur et l’hébergeur du site
            <strong className="text-indigo-600"> MaiSeoM</strong>.
          </p>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="max-w-4xl mx-auto px-6 py-16 leading-relaxed text-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Éditeur du site</h2>
        <p>
          Le site <strong>maiseom.com</strong> est édité par :
          <br />
          <strong>MaiSeoM</strong>
          <br />
          Représenté par : Melvyn Sel
          <br />
          Email : contact@maiseom.com
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. Hébergement</h2>
        <p>
          Hébergement assuré par :
          <br />
          <strong>Vercel Inc.</strong>
          <br />
          Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Propriété intellectuelle</h2>
        <p>
          L’ensemble du contenu présent sur le site maiseom.com (textes, images, graphismes,
          logo, code, etc.) est la propriété exclusive de MaiSeoM, sauf mention contraire.
          Toute reproduction ou représentation, totale ou partielle, sans autorisation
          préalable est interdite.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Responsabilité</h2>
        <p>
          MaiSeoM met tout en œuvre pour assurer l’exactitude des informations diffusées
          sur le site. Toutefois, la responsabilité de MaiSeoM ne saurait être engagée
          en cas d’erreurs ou omissions. L’utilisateur reconnaît utiliser le site sous
          sa propre responsabilité.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">5. Données personnelles</h2>
        <p>
          Les informations collectées via les formulaires du site sont utilisées dans le
          cadre exclusif de la relation commerciale entre MaiSeoM et ses utilisateurs.
          Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et
          de suppression de vos données en nous contactant à :
          <strong> contact@maiseom.com</strong>.
        </p>
      </section>

      <div className="h-2 w-full bg-gradient-to-r from-indigo-600 to-purple-600" />
    </main>
  );
}

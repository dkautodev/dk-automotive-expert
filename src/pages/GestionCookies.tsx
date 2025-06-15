
import React from 'react';

const GestionCookies = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-dk-navy mb-8">Gestion des Cookies</h1>
      
      <div className="prose max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-dk-navy mb-4">Qu'est-ce qu'un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) 
            lors de la visite d'un site internet. Il permet de reconnaître votre navigateur et de conserver 
            certaines informations vous concernant.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-dk-navy mb-4">Utilisation des cookies sur notre site</h2>
          <p>
            Notre site utilise des cookies pour améliorer votre expérience de navigation et analyser 
            l'utilisation de notre site. Ces cookies nous permettent de :
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Mémoriser vos préférences de navigation</li>
            <li>Analyser le trafic et l'utilisation de notre site</li>
            <li>Améliorer nos services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-dk-navy mb-4">Gestion de vos cookies</h2>
          <p>
            Vous pouvez à tout moment modifier vos préférences concernant les cookies via les paramètres 
            de votre navigateur. Pour plus d'informations sur la gestion des cookies, consultez l'aide 
            de votre navigateur.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-dk-navy mb-4">Contact</h2>
          <p>
            Pour toute question concernant notre politique de cookies, contactez-nous à : 
            <a href="mailto:dkautomotive70@gmail.com" className="text-blue-600 hover:underline ml-1">
              dkautomotive70@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default GestionCookies;

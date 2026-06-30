/* ──────────────────────────────────────────────────────────────
   PRODUCT INSTRUCTIONS
────────────────────────────────────────────────────────────── */
export const INSTRUCTIONS: Record<string, { steps: string[]; note?: string }> =
  {
    Roblox: {
      steps: [
        "Ve a roblox.com/redeem",
        "Inicia sesión en tu cuenta",
        "Ingresa el código y haz clic en Canjear",
        "Los Robux aparecerán en tu cuenta al instante",
      ],
    },
    Fortnite: {
      steps: [
        "Abre el juego Fortnite",
        "Ve a la Tienda del ítem",
        "Selecciona el ícono de regalo (esquina superior)",
        "Ingresa el código y confirma",
      ],
    },
    Steam: {
      steps: [
        "Abre Steam en tu PC o navegador",
        "Ve a Juegos > Canjear un código de Steam",
        "Ingresa el código exactamente como aparece",
        "El saldo o juego se añadirá a tu cuenta",
      ],
    },
    PSN: {
      steps: [
        "Abre PlayStation Store",
        "Selecciona tu avatar en la parte superior",
        "Elige 'Canjear códigos'",
        "Ingresa el código de 12 dígitos y confirma",
      ],
    },
    Xbox: {
      steps: [
        "Ve a xbox.com/redeem o abre la app Xbox",
        "Inicia sesión en tu cuenta Microsoft",
        "Ingresa el código de 25 caracteres",
        "El saldo se añadirá inmediatamente",
      ],
    },
    "Riot Games": {
      steps: [
        "Ve a riotgames.com/es-es/riot-points-shop",
        "Inicia sesión en tu cuenta Riot",
        "Selecciona 'Canjear código'",
        "Los puntos se acreditarán en tu cuenta",
      ],
      note: "Aplica para Valorant VP y League of Legends RP.",
    },
    Discord: {
      steps: [
        "Ve a discord.com o abre la app",
        "Haz clic en Configuración > Nitro",
        "Selecciona '¿Ya tienes un código?'",
        "Ingresa el código y disfruta Nitro",
      ],
    },
    Spotify: {
      steps: [
        "Ve a spotify.com/redeem",
        "Inicia sesión en tu cuenta Spotify",
        "Ingresa el código de regalo",
        "La suscripción Premium se activará de inmediato",
      ],
    },
    Netflix: {
      steps: [
        "Ve a netflix.com/redeem",
        "Inicia sesión o crea una cuenta",
        "Ingresa el código del regalo",
        "Tu suscripción quedará activa",
      ],
    },
    Google: {
      steps: [
        "Abre la app Google Play en tu dispositivo",
        "Toca tu foto de perfil",
        "Ve a Pagos y suscripciones > Canjear código",
        "Ingresa el código y confirma",
      ],
    },
    Apple: {
      steps: [
        "Abre App Store en tu iPhone o iPad",
        "Toca tu foto de perfil",
        "Selecciona 'Canjear regalo o código'",
        "Ingresa el código o apunta la cámara",
      ],
    },
  };

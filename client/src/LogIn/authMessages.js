// Mensajes de las pantallas de login y registro: inglés principal + apoyo en español.
// type: 'error' | 'success' | 'info'

export const AUTH_MESSAGES = {
    // Validaciones de los campos
    emailEmpty: {
        en: 'Please enter your email.',
        es: 'Escribe tu correo electrónico.',
    },
    emailInvalid: {
        en: 'This email doesn\'t look right. Example: name@mail.com',
        es: 'El correo no parece válido. Ejemplo: nombre@correo.com',
    },
    passwordEmpty: {
        en: 'Please enter your password.',
        es: 'Escribe tu contraseña.',
    },
    passwordShort: {
        en: 'Your password needs at least 6 characters.',
        es: 'Tu contraseña necesita al menos 6 caracteres.',
    },
    usernameEmpty: {
        en: 'Please choose a username.',
        es: 'Elige un nombre de usuario.',
    },
    passwordsDontMatch: {
        en: 'The passwords don\'t match.',
        es: 'Las contraseñas no coinciden.',
    },

    // Respuestas del servidor
    wrongCredentials: {
        type: 'error',
        en: 'Email or password is incorrect. Check them and try again.',
        es: 'El correo o la contraseña son incorrectos. Revísalos e intenta de nuevo.',
    },
    alreadyRegistered: {
        type: 'error',
        en: 'That email or username is already taken. Try logging in or use a different one.',
        es: 'Ese correo o nombre de usuario ya está registrado. Inicia sesión o usa otro.',
    },
    noConnection: {
        type: 'error',
        en: 'We couldn\'t reach the town. Check your internet connection and try again.',
        es: 'No pudimos conectar con el pueblo. Revisa tu conexión a internet e intenta de nuevo.',
    },
    somethingWentWrong: {
        type: 'error',
        en: 'Something went wrong. Please try again in a moment.',
        es: 'Algo salió mal. Intenta de nuevo en un momento.',
    },
    serverWaking: {
        type: 'info',
        en: 'Waking up the town... this can take up to a minute the first time.',
        es: 'Despertando el pueblo... la primera vez puede tardar hasta un minuto.',
    },

    // Éxito
    loginSuccess: {
        type: 'success',
        en: 'Log in successful! Welcome home...',
        es: '¡Sesión iniciada! Bienvenido a casa...',
    },
    registerSuccess: {
        type: 'success',
        en: 'Account created! Taking you to log in...',
        es: '¡Cuenta creada! Te llevamos a iniciar sesión...',
    },
};

// Tiempo sin respuesta tras el cual se avisa que el servidor está despertando
export const SLOW_SERVER_DELAY_MS = 4000;

// Traduce un error de loginUser/registerUser al mensaje que verá el jugador
export const getAuthErrorMessage = (error, context) => {
    // fetch lanza TypeError cuando no hay red o el servidor no responde
    if (error instanceof TypeError) {
        return AUTH_MESSAGES.noConnection;
    }
    if (context === 'login' && error.status === 401) {
        return AUTH_MESSAGES.wrongCredentials;
    }
    if (context === 'register' && error.status === 400 && /registrad/i.test(error.message)) {
        return AUTH_MESSAGES.alreadyRegistered;
    }
    return AUTH_MESSAGES.somethingWentWrong;
};

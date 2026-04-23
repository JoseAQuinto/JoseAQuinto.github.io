export const apiUtilitiesTranslations = {
  es: {
    apiUtilitiesLabel: "API Utilities",
    apiDocumentationTitle: "Documentación de API de utilidades",
    apiDocumentationDescription:
      "Documentación visual de utilidades API preparada para Supabase. Incluye ejemplos de peticiones, respuestas JSON y un playground interactivo para mostrar cómo se consumirían los endpoints.",
    backToPortfolio: "Volver al portfolio",

    loadingSession: "Cargando sesión...",

    requestExample: "Ejemplo de petición",
    responseExample: "Ejemplo de respuesta",
    noRequestBody: "Sin cuerpo de petición",

    back: "Volver",
    loginRequired: "Inicio de sesión requerido",
    loginInfoAriaLabel: "Información sobre este acceso",
    demoAuthenticationTitle: "Autenticación real",
    demoAuthenticationDescription:
      "Este módulo utiliza autenticación real con Supabase. El acceso protege las utilidades y demuestra control de sesión.",
    emailPlaceholder: "Correo electrónico",
    passwordPlaceholder: "Contraseña",
    login: "Entrar",
    loggingIn: "Entrando...",
    demoCredentialsLabel: "Credenciales de demo",
    supabaseNotConfigured: "Supabase no está configurado.",
    loginError: "Error de inicio de sesión.",

    playgroundLabel: "Playground",
    interactiveRequestPreview: "Vista previa interactiva de la petición",
    playgroundUtilitiesDescription:
      "Este panel ejecuta utilidades. Si Supabase está configurado, podrá invocar Edge Functions; si no, usa modo mock.",
    playgroundCrudDescription:
      "Este panel ejecuta operaciones CRUD sobre la tabla notes. Si Supabase no está configurado todavía, usa datos mock locales.",
    supabaseMode: "Modo Supabase",
    mockMode: "Modo mock",
    statusOk: "200 OK",
    statusLoading: "Cargando...",
    statusError: "400 ERROR",
    requestBody: "Cuerpo de la petición",
    sendRequest: "Enviar petición",
    sendingRequest: "Enviando...",
    reset: "Restablecer",
    response: "Respuesta",
    unknownError: "Error desconocido.",

    utilitiesTab: "Utilidades",
    crudTab: "CRUD Supabase",

    loggedAs: "Conectado como:",
    notAuthenticated: "No autenticado",

    endpoints: "Endpoints",
    databaseLabel: "base de datos",
    utilityLabel: "utilidad",

    unsupportedMockEndpoint: "Endpoint no soportado en modo mock.",
    supabaseFunctionExecutionError:
      "Error ejecutando la función en Supabase.",

    noteIdRequiredForUpdate: "El campo id es obligatorio para actualizar.",
    noteIdRequiredForDelete: "El campo id es obligatorio para borrar.",
    noteNotFound: "No existe una nota con id {id}.",
    errorFetchingNotes: "Error obteniendo notas.",
    errorCreatingNote: "Error creando nota.",
    errorUpdatingNote: "Error actualizando nota.",
    errorDeletingNote: "Error borrando nota.",
    unsupportedCrudEndpoint: "Endpoint CRUD no soportado.",

    crudGetNotesTitle: "Obtener todas las notas",
    crudGetNotesDescription:
      "Lee todas las notas almacenadas en Supabase. Si Supabase no está configurado, utiliza datos mock locales.",

    crudCreateNoteTitle: "Crear una nueva nota",
    crudCreateNoteDescription:
      "Crea una nueva nota en Supabase usando título y contenido.",

    crudUpdateNoteTitle: "Actualizar una nota existente",
    crudUpdateNoteDescription:
      "Actualiza una nota por id. Puedes enviar título, contenido o ambos.",

    crudDeleteNoteTitle: "Eliminar una nota",
    crudDeleteNoteDescription:
      "Elimina una nota por id de Supabase.",

    utilityUppercaseTitle: "Transformar texto a mayúsculas",
    utilityUppercaseDescription:
      "Recibe una cadena de texto y devuelve el mismo contenido transformado a mayúsculas.",

    utilitySlugifyTitle: "Generar un slug para URL",
    utilitySlugifyDescription:
      "Convierte una cadena de texto en un slug limpio y válido para URLs.",

    utilityCountWordsTitle: "Contar palabras en un texto",
    utilityCountWordsDescription:
      "Devuelve el número total de palabras y caracteres del texto de entrada.",
    notesTableEyebrow: "Live data",
    notesTableTitle: "Tabla de notas",
    notesTableDescription:
      "Vista de los registros actuales. Se actualiza tras las operaciones CRUD para reflejar el estado real de los datos.",
    refreshTable: "Actualizar tabla",
    notesTableTitleColumn: "Título",
    notesTableContentColumn: "Contenido",
    notesTableCreatedAtColumn: "Creado",
    loadingTable: "Cargando datos...",
    noNotesAvailable: "No hay notas disponibles.",
  },

  en: {
    apiUtilitiesLabel: "API Utilities",
    apiDocumentationTitle: "Utility API Documentation",
    apiDocumentationDescription:
      "Visual API utilities documentation prepared for Supabase. It includes request examples, JSON responses, and an interactive playground to show how the endpoints would be consumed.",
    backToPortfolio: "Back to portfolio",

    loadingSession: "Loading session...",

    requestExample: "Request example",
    responseExample: "Response example",
    noRequestBody: "No request body",

    back: "Back",
    loginRequired: "Login required",
    loginInfoAriaLabel: "Information about this login",
    demoAuthenticationTitle: "Real authentication",
    demoAuthenticationDescription:
      "This module uses real authentication powered by Supabase. The login protects the utilities and demonstrates session-based access control.",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password",
    login: "Login",
    loggingIn: "Logging in...",
    demoCredentialsLabel: "Demo credentials",
    supabaseNotConfigured: "Supabase is not configured.",
    loginError: "Login error.",

    playgroundLabel: "Playground",
    interactiveRequestPreview: "Interactive request preview",
    playgroundUtilitiesDescription:
      "This panel runs utilities. If Supabase is configured, it can invoke Edge Functions; otherwise, it uses mock mode.",
    playgroundCrudDescription:
      "This panel runs CRUD operations on the notes table. If Supabase is not configured yet, it uses local mock data.",
    supabaseMode: "Supabase mode",
    mockMode: "Mock mode",
    statusOk: "200 OK",
    statusLoading: "Loading...",
    statusError: "400 ERROR",
    requestBody: "Request body",
    sendRequest: "Send request",
    sendingRequest: "Sending...",
    reset: "Reset",
    response: "Response",
    unknownError: "Unknown error.",

    utilitiesTab: "Utilities",
    crudTab: "Supabase CRUD",

    loggedAs: "Logged as:",
    notAuthenticated: "Not authenticated",

    endpoints: "Endpoints",
    databaseLabel: "database",
    utilityLabel: "utility",

    unsupportedMockEndpoint: "Unsupported endpoint in mock mode.",
    supabaseFunctionExecutionError:
      "Error executing the function in Supabase.",

    noteIdRequiredForUpdate: "The id field is required for update.",
    noteIdRequiredForDelete: "The id field is required for delete.",
    noteNotFound: "No note exists with id {id}.",
    errorFetchingNotes: "Error fetching notes.",
    errorCreatingNote: "Error creating note.",
    errorUpdatingNote: "Error updating note.",
    errorDeletingNote: "Error deleting note.",
    unsupportedCrudEndpoint: "Unsupported CRUD endpoint.",

    crudGetNotesTitle: "Get all notes",
    crudGetNotesDescription:
      "Reads all notes stored in Supabase. If Supabase is not configured yet, it falls back to local mock data.",

    crudCreateNoteTitle: "Create a new note",
    crudCreateNoteDescription:
      "Creates a new note in Supabase using title and content.",

    crudUpdateNoteTitle: "Update an existing note",
    crudUpdateNoteDescription:
      "Updates a note by id. You can send title, content, or both.",

    crudDeleteNoteTitle: "Delete a note",
    crudDeleteNoteDescription:
      "Deletes a note by id from Supabase.",

    utilityUppercaseTitle: "Transform text to uppercase",
    utilityUppercaseDescription:
      "Receives a text string and returns the same content transformed to uppercase.",

    utilitySlugifyTitle: "Generate a URL slug",
    utilitySlugifyDescription:
      "Converts a text string into a clean URL-friendly slug.",

    utilityCountWordsTitle: "Count words in a text",
    utilityCountWordsDescription:
      "Returns the total number of words and characters from the input text.",
    notesTableEyebrow: "Live data",
    notesTableTitle: "Notes table",
    notesTableDescription:
      "View of the current records. It refreshes after CRUD operations to reflect the real state of the data.",
    refreshTable: "Refresh table",
    notesTableTitleColumn: "Title",
    notesTableContentColumn: "Content",
    notesTableCreatedAtColumn: "Created",
    loadingTable: "Loading data...",
    noNotesAvailable: "No notes available.",
  },
} as const;
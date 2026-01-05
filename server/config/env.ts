/**
 * Environment Configuration Validator
 * Validates required environment variables before starting the application
 */

export interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  mysql: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  session: {
    secret: string;
  };
}

export function validateEnvironment(): EnvironmentConfig {
  const requiredVars = ['SESSION_SECRET', 'MYSQL_PASSWORD'];
  const missing: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please create a .env file based on .env.example and set all required values.`
    );
  }

  // Validate SESSION_SECRET length in production
  if (process.env.NODE_ENV === 'production' && process.env.SESSION_SECRET!.length < 32) {
    throw new Error(
      'SESSION_SECRET must be at least 32 characters long in production.\n' +
      'Generate a secure secret using: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
    );
  }

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    mysql: {
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306', 10),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD!,
      database: process.env.MYSQL_DATABASE || 'university_staff_tracker',
    },
    session: {
      secret: process.env.SESSION_SECRET!,
    },
  };
}

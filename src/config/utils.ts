import config from './index'

export function getDatabaseUrl(): string {
  return `${config.database?.url}/${config.database?.name}`
}

export function validateRequiredConfig(requiredFields: (keyof typeof config)[]): void {
  const missingFields: string[] = []
  
  for (const field of requiredFields) {
    if (!config[field]) {
      missingFields.push(field as string)
    }
  }
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required configuration fields: ${missingFields.join(', ')}`)
  }
}


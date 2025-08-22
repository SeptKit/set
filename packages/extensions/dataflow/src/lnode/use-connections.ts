import Dexie from 'dexie'
import { type Connection } from './connection'

export type ConnectionSDK = ReturnType<typeof useConnections>

export function useConnections(db: Dexie) {
	return {
		findAllExistingFromDB,
		close,
	}

	// Get all existing connections from the database via SourceRef elements
	async function findAllExistingFromDB(): Promise<Connection[]> {
		// TODO
		return []
	}
}

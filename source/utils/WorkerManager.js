/**
 * The worker manager is responsible for creating and managing worker instances.
 * 
 * Workers are created and managed by the worker manager. Workers can be requested to perform tasks.
 * 
 * After a worker has finished performing a task, it is returned to the worker manager for reuse.
 */
class WorkerManager 
{
	constructor() 
	{
		this.workers = [];
	}

	/**
	 * Get a worker from the pool, if none available one will be created.
	 */
	getWorker(type) 
	{
		if (!this.workers[type]) 
		{
			this.workers[type] = [];
		}

		if (this.workers[type].length > 0) 
		{
			return this.workers[type].pop();
		}

		switch (type) 
		{
		case WorkerManager.BINARY_DECODER:
			return new Worker(new URL('../workers/BinaryDecoderWorker.js', import.meta.url));
		case WorkerManager.LAS_LAZ:
			return new Worker(new URL('../workers/LASLAZWorker.js', import.meta.url));
		case WorkerManager.LAS_DECODER:
			return new Worker(new URL('../workers/LASDecoderWorker.js', import.meta.url));
		case WorkerManager.DEM:
			return new Worker(new URL('../workers/DEMWorker.js', import.meta.url));
		case WorkerManager.EPT_LAS_ZIP_DECODER:
			return new Worker(new URL('../workers/EptLaszipDecoderWorker.js', import.meta.url));
		case WorkerManager.EPT_BINARY_DECODER:
			return new Worker(new URL('../workers/EptBinaryDecoderWorker.js', import.meta.url));
		default:
			throw new Error('Unknown worker type.');
		}
	}

	/**
	 * Return (reinsert) the worker into the pool.
	 */
	returnWorker(type, worker) 
	{
		this.workers[type].push(worker);
	}

	/**
	 * Run a task immediatly.
	 */
	runTask(type, onMessage, message, transfer) 
	{
		const self = this;

		const worker = this.getWorker(type);
		worker.onmessage = function(event) 
		{
			onMessage(event);
			self.returnWorker(type, worker);
		};

		if (transfer !== undefined) 
		{
			worker.postMessage(message, transfer);
		}
		else 
		{
			worker.postMessage(message);
		}
	}
}

WorkerManager.BINARY_DECODER = 0;
WorkerManager.LAS_LAZ = 1;
WorkerManager.LAS_DECODER = 2;
WorkerManager.DEM = 3;
WorkerManager.EPT_LAS_ZIP_DECODER = 4;
WorkerManager.EPT_BINARY_DECODER = 5;

export {WorkerManager};

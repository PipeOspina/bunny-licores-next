export interface IImage {
	publicURL: string;
	storePath: string;
}

export interface IProductImage {
	default: IImage;
	all: IImage[];
}

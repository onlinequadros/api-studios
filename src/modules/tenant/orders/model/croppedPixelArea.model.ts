import { IsNotEmpty, IsNumber } from "class-validator"

export class CroppedPixelArea {
    @IsNotEmpty()
    @IsNumber()
    width: number;
	height: number;
	x: number;
	y: number;
}
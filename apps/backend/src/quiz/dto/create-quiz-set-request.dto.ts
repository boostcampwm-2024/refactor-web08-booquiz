import { ApiProperty } from '@nestjs/swagger';
import { Quiz } from '../entity/quiz.entitiy';
import { QuizSet } from '../entity/quiz-set.entity';
import {
    ArrayMaxSize,
    ArrayMinSize,
    IsBoolean,
    IsEnum,
    IsNumber,
    IsString,
    Length,
    Max,
    Min,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {QUIZ_TYPE} from "@web08-booquiz/shared";

export class QuizDetailsDto {
    @ApiProperty({ description: '퀴즈 질문' })
    @IsString({ message: '퀴즈 질문은 문자열이어야 합니다.' })
    @Length(1, 200, { message: '퀴즈의 질문은 1~200자 이어야 합니다.' })
    readonly question: string;

    @ApiProperty({ description: '퀴즈 정답' })
    @IsString({ message: '퀴즈 정답은 문자열이어야 합니다.' })
    @Length(1, 30, { message: '퀴즈의 대답은 1~30자 이어야 합니다.' })
    readonly answer: string;

    @ApiProperty({ description: '퀴즈 시간' })
    @Min(3, { message: '퀴즈 시간은 3초 이상이어야 합니다.' })
    @Max(60 * 10, { message: '퀴즈 시간은 10분 이하여야 합니다.' })
    @IsNumber({}, { message: '퀴즈 시간 값이 숫자가 아닙니다.' })
    readonly playTime: number;

    @ApiProperty({ description: '퀴즈 타입' })
    @IsEnum(QUIZ_TYPE, { message: '정해진 퀴즈 타입이 아닙니다.' })
    readonly quizType: QUIZ_TYPE;

    toEntity(quizSet: QuizSet) {
        return new Quiz(this.question, this.answer, this.playTime, this.quizType, quizSet);
    }
}

export class CreateQuizSetRequestDto {
    @ApiProperty()
    @IsString({ message: '퀴즈셋의 이름은 문자열이어야 합니다.' })
    @Length(1, 30, { message: '퀴즈셋의 이름은 1~30자 이어야 합니다.' })
    readonly quizSetName: string;

    @ApiProperty({ description: '퀴즈셋이 기본으로 보일지 결정하는 flag입니다' })
    @IsBoolean({ message: '값이 boolean이어야 합니다.' })
    readonly recommended?: boolean = false;

    @ApiProperty({ type: [QuizDetailsDto], description: '퀴즈 세부 정보' })
    @ValidateNested({ each: true })
    @ArrayMinSize(1, { message: '퀴즈가 한개 이상 포함되어야합니다.' })
    @ArrayMaxSize(10, { message: '퀴즈는 최대 10개만 생성할 수 있습니다.' })
    @Type(() => QuizDetailsDto)
    readonly quizDetails: QuizDetailsDto[];
}

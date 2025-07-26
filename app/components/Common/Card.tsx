import type { CardProps } from 'tamagui'
import { Button, Card, H2, Image, Paragraph, XStack } from 'tamagui'

type Props = CardProps & {
    title: string;
    buttonTitle: string;
    description: string;
}

const CardC: React.FC<Props> = (props) => {
    return (
        <Card elevate size="$4" bordered {...props}>
            <Card.Header padded>
                <H2>{props.title}</H2>
                <Paragraph theme="alt2">{props.description}</Paragraph>
            </Card.Header>
            <Card.Footer padded>
                <XStack flex={1} />
                <Button borderRadius="$10">{props.buttonTitle}</Button>
            </Card.Footer>
            <Card.Background>

            </Card.Background>
        </Card>
    )
}

export default CardC;
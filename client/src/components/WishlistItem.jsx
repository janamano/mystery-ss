import React, { useCallback } from 'react';
import { Button, Icon, Item } from 'semantic-ui-react';
import { LOCAL } from '../endpoints';

export default function WishlistItem(props) {


    return (
        <React.Fragment>
             <Item>
                <Item.Content>
                    <Item.Header className='wishlistItem' as='a' href={props.itemLink} target="_blank">{props.itemName}</Item.Header>
                    {props.showControls &&
                    <Button.Group floated='right'>
                        {/* <Button onClick={props.editWish} size='mini' icon inverted color='yellow'>
                            <Icon name='edit' />
                        </Button> */}
                        <Button onClick={props.deleteWish} size='mini' icon inverted color='red'>
                            <Icon name='delete' />
                        </Button>
                    </Button.Group>}

                </Item.Content>
             </Item>
        </React.Fragment>
    );
}
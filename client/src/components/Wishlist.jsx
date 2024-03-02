import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Icon, Item, Segment } from 'semantic-ui-react';
import WishlistItem from './WishlistItem';
import Modal from 'react-bootstrap/Modal';
import { LOCAL } from '../endpoints';
import { MAKE_WISH, DELETE_WISH } from './mutations/mutations';
import { useMutation } from '@apollo/client';
import { GET_CURRENT_USER_DETAILS } from './queries/queries';
export default function Wishlist(props) {

    const [open, setOpen] = useState(false);
    const [itemNameInput, setItemNameInput] = useState('');
    const [itemLinkInput, setItemLinkInput] = useState('');
    const [message, setMessage] = useState('')
    const [wishes, setWishes] = useState([]);
    const [makeWish, makeWishResults] = useMutation(MAKE_WISH)
    const [deleteWish, deleteWishResults] = useMutation(DELETE_WISH)



    const createLink = useCallback((itemName) => {
        var wishNameAsQueryParam = itemName.split(' ').join('+')
        return 'https://www.amazon.ca/s?k=' + wishNameAsQueryParam;
    }, [])

    const handleWish = useCallback(() => {
        makeWish({
            variables: {
                wishName: itemNameInput,
                wishLink: itemLinkInput.length > 0 ? itemLinkInput : createLink(itemNameInput)    
            },
            refetchQueries: [
                GET_CURRENT_USER_DETAILS
            ],
            onCompleted: () => {
                setOpen(false)
            }
        })
    }, [createLink, itemLinkInput, itemNameInput, makeWish])

    useEffect(() => {
        if (makeWishResults.error != null) {
            setMessage("Could not add the wish :/")
        }
    })
    const handleDelete = useCallback((wishId) => {
        deleteWish({
            variables: {
                wishId: wishId
            },
            refetchQueries: [
                GET_CURRENT_USER_DETAILS
            ]
        })
    }, [deleteWish])

    return (
    <Segment>
        <Button primary animated onClick={() => {
            setOpen(true);
            setItemNameInput('');
            setItemLinkInput('');}}>
            <Button.Content visible><Icon name='hand point right' />Add an Item</Button.Content>
            <Button.Content hidden><Icon name='tag' /><Icon name='tag' /><Icon name='tag' /></Button.Content>
        </Button>

        <Modal show={open} onHide={() => setOpen(false)}>
            <Modal.Header closeButton>
                <Modal.Title>                
                    <Icon name='heart' />
                    Add Item to Wishlist
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Input label="Enter Item name" onChange={(event) => {
                            setItemNameInput(event.target.value)
                        }}  value={itemNameInput} />
                    <Form.Input label='Enter Link (Optional)' onChange={(event) => {
                            setItemLinkInput(event.target.value)
                        }} value={itemLinkInput}/>         
                </Form>
            </Modal.Body>
            {message != null && message.length != 0 && 
            <div className="wishListMessages">{message}</div>}
            <Modal.Footer>
                
                <Button.Group>
                    <Button color='red' onClick={() => { setOpen(false); setMessage('')}}>
                        <Icon name='remove' /> Actually, Nevermind
                    </Button>
                    <Button.Or  />
                    <Button color='green' onClick={() => {
                        handleWish();
                    }}>
                        <Icon name='checkmark' /> Add
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
        <Item.Group divided>
            {props.wishes.map((wishItem) => {
                return <WishlistItem 
                    deleteWish={() => { handleDelete(wishItem._id)}}
                    itemName={wishItem.wishName}
                    itemLink={wishItem.wishLink}
                    showControls={true}/>
            })}
        </Item.Group>
    </Segment>)
}
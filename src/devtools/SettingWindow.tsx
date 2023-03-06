import React from 'react';
import './App.css';
import {
    Button,
    Dialog, DialogContent, DialogActions, DialogTitle, DialogContentText, TextField,
} from '@mui/material';
import { Settings } from './types'

const { useEffect } = React

interface Props {
    open: boolean
    settings: Settings
    close(): void
    save(settings: Settings): void
}

export default function SettingWindow(props: Props) {
    const [apiKeyInput, setApiKeyInput] = React.useState('');
    useEffect(() => {
        setApiKeyInput(props.settings.openaiKey)
    }, [props.settings.openaiKey])

    return (
        <Dialog open={props.open} onClose={props.close}>
            <DialogTitle>Settings</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="apikey"
                    label="OpenAI API Key"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.close}>Cancel</Button>
                <Button onClick={() => props.save({
                    ...props.settings,
                    openaiKey: apiKeyInput,
                })}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

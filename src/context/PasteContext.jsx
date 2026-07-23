import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';
import { useAuth } from './AuthContext';

const initialState = {
  pastes: [],
  folders: [],
  apiKeys: [],
  currentPaste: null,
  isLoading: false,
  error: null,
};

const pasteReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, pastes: action.payload, error: null };
    case 'FETCH_FAILURE':
      return { ...state, isLoading: false, error: action.payload };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        pastes: [...state.pastes, action.payload],
        error: null,
      };
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        pastes: state.pastes.map((paste) =>
          paste._id === action.payload._id ? action.payload : paste
        ),
        currentPaste: action.payload,
        error: null,
      };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        pastes: state.pastes.filter((paste) => paste._id !== action.payload),
        error: null,
      };
    case 'GET_PASTE_SUCCESS':
      return {
        ...state,
        isLoading: false,
        currentPaste: action.payload,
        error: null,
      };
    case 'FETCH_FOLDERS_SUCCESS':
      return { ...state, isLoading: false, folders: action.payload, error: null };
    case 'CREATE_FOLDER_SUCCESS':
      return { ...state, isLoading: false, folders: [...state.folders, action.payload], error: null };
    case 'DELETE_FOLDER_SUCCESS':
      return { ...state, isLoading: false, folders: state.folders.filter(f => f._id !== action.payload), error: null };
    case 'FETCH_KEYS_SUCCESS':
      return { ...state, isLoading: false, apiKeys: action.payload, error: null };
    case 'CREATE_KEY_SUCCESS':
      return { ...state, isLoading: false, apiKeys: [...state.apiKeys, action.payload], error: null };
    case 'DELETE_KEY_SUCCESS':
      return { ...state, isLoading: false, apiKeys: state.apiKeys.filter(k => k._id !== action.payload), error: null };
    case 'TOGGLE_STAR_SUCCESS':
      return {
        ...state,
        pastes: state.pastes.map((p) =>
          p._id === action.payload._id ? { ...p, isStarred: action.payload.isStarred } : p
        ),
        currentPaste: state.currentPaste && state.currentPaste._id === action.payload._id 
          ? { ...state.currentPaste, isStarred: action.payload.isStarred } 
          : state.currentPaste,
        error: null
      };
    default:
      return state;
  }
};

const PasteContext = createContext({
  ...initialState,
  fetchPastes: async () => {},
  createPaste: async () => {},
  updatePaste: async () => {},
  deletePaste: async () => {},
  getPasteById: async () => {},
  getPublicPasteById: async () => {},
  searchPastes: async () => {},
  fetchOverviewStats: async () => {},
  fetchFolders: async () => {},
  createFolder: async () => {},
  deleteFolder: async () => {},
  fetchApiKeys: async () => {},
  createApiKey: async () => {},
  deleteApiKey: async () => {},
  toggleStarPaste: async () => {},
});

export const usePaste = () => useContext(PasteContext);

export const PasteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pasteReducer, initialState);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchPastes();
    }
  }, [token]);

  const fetchPastes = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.get('/pastes');
      dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to fetch pastes',
      });
    }
  };

  const createPaste = async (paste) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.post('/pastes', paste);
      dispatch({ type: 'CREATE_SUCCESS', payload: res.data });
      return res.data;
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to create paste',
      });
      throw error;
    }
  };

  const updatePaste = async (id, paste) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.put(`/pastes/${id}`, paste);
      dispatch({ type: 'UPDATE_SUCCESS', payload: res.data });
      return res.data;
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to update paste',
      });
      throw error;
    }
  };

  const deletePaste = async (id) => {
    dispatch({ type: 'FETCH_START' });
    try {
      await api.delete(`/pastes/${id}`);
      dispatch({ type: 'DELETE_SUCCESS', payload: id });
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to delete paste',
      });
      throw error;
    }
  };

  const getPasteById = async (id) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.get(`/pastes/${id}`);
      dispatch({ type: 'GET_PASTE_SUCCESS', payload: res.data });
      return res.data;
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to get paste',
      });
      throw error;
    }
  };

  const searchPastes = async (query) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.get(`/pastes/search?q=${query}`);
      dispatch({ type: 'FETCH_SUCCESS', payload: res.data });
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to search pastes',
      });
    }
  };

  const getPublicPasteById = async (id) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.get(`/pastes/public/${id}`);
      dispatch({ type: 'GET_PASTE_SUCCESS', payload: res.data });
      return res.data;
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to get public paste',
      });
      throw error;
    }
  };

  const fetchOverviewStats = async () => {
    try {
      const res = await api.get('/pastes/stats/overview');
      return res.data;
    } catch (error) {
      console.error('Failed to fetch overview stats', error);
      throw error;
    }
  };

  const fetchFolders = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.get('/folders');
      dispatch({ type: 'FETCH_FOLDERS_SUCCESS', payload: res.data });
      return res.data;
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to fetch folders',
      });
      throw error;
    }
  };

  const createFolder = async (name) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.post('/folders', { name });
      dispatch({ type: 'CREATE_FOLDER_SUCCESS', payload: res.data });
      return res.data;
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to create folder',
      });
      throw error;
    }
  };

  const deleteFolder = async (id) => {
    dispatch({ type: 'FETCH_START' });
    try {
      await api.delete(`/folders/${id}`);
      dispatch({ type: 'DELETE_FOLDER_SUCCESS', payload: id });
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to delete folder',
      });
      throw error;
    }
  };

  const fetchApiKeys = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.get('/auth/keys');
      dispatch({ type: 'FETCH_KEYS_SUCCESS', payload: res.data });
      return res.data;
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to fetch API keys',
      });
      throw error;
    }
  };

  const createApiKey = async (name) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.post('/auth/keys', { name });
      dispatch({ type: 'CREATE_KEY_SUCCESS', payload: res.data });
      return res.data;
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to create API key',
      });
      throw error;
    }
  };

  const deleteApiKey = async (id) => {
    dispatch({ type: 'FETCH_START' });
    try {
      await api.delete(`/auth/keys/${id}`);
      dispatch({ type: 'DELETE_KEY_SUCCESS', payload: id });
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to revoke API key',
      });
      throw error;
    }
  };

  const toggleStarPaste = async (id) => {
    try {
      const res = await api.put(`/pastes/${id}/star`);
      dispatch({ type: 'TOGGLE_STAR_SUCCESS', payload: res.data });
      return res.data;
    } catch (error) {
      console.error('Failed to toggle star status', error);
      throw error;
    }
  };

  return (
    <PasteContext.Provider
      value={{
        ...state,
        fetchPastes,
        createPaste,
        updatePaste,
        deletePaste,
        getPasteById,
        getPublicPasteById,
        searchPastes,
        fetchOverviewStats,
        fetchFolders,
        createFolder,
        deleteFolder,
        fetchApiKeys,
        createApiKey,
        deleteApiKey,
        toggleStarPaste,
      }}
    >
      {children}
    </PasteContext.Provider>
  );
}; 

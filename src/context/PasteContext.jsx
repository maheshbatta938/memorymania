import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import api from '../services/api';
import { useAuth } from './AuthContext';

const initialState = {
  pastes: [],
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
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to create paste',
      });
    }
  };

  const updatePaste = async (id, paste) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.put(`/pastes/${id}`, paste);
      dispatch({ type: 'UPDATE_SUCCESS', payload: res.data });
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to update paste',
      });
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
    }
  };

  const getPasteById = async (id) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const res = await api.get(`/pastes/${id}`);
      dispatch({ type: 'GET_PASTE_SUCCESS', payload: res.data });
    } catch (error) {
      dispatch({
        type: 'FETCH_FAILURE',
        payload: error.response?.data?.message || 'Failed to get paste',
      });
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
      }}
    >
      {children}
    </PasteContext.Provider>
  );
}; 

// localStorage React Hook

const { useState, useEffect, useCallback } = React;

function useJars() {
  const [jars, setJars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setJars(getJars());
    setLoading(false);
  }, []);

  const refresh = useCallback(() => {
    setJars(getJars());
  }, []);

  const add = useCallback((jarData) => {
    const jar = addJar(jarData);
    refresh();
    return jar;
  }, [refresh]);

  const update = useCallback((id, updates) => {
    const jar = updateJar(id, updates);
    refresh();
    return jar;
  }, [refresh]);

  const remove = useCallback((id) => {
    deleteJar(id);
    refresh();
  }, [refresh]);

  const addTime = useCallback((jarId, recordData) => {
    const result = addRecord(jarId, recordData);
    refresh();
    return result;
  }, [refresh]);

  const removeRecord = useCallback((jarId, recordId) => {
    const jar = deleteRecord(jarId, recordId);
    refresh();
    return jar;
  }, [refresh]);

  return { jars, loading, refresh, add, update, remove, addTime, removeRecord };
}

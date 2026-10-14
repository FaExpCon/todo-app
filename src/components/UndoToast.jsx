function UndoToast({ deleted, onUndo, buttonRef }) {
  return (
    <div className="undo-toast" aria-hidden={!deleted}>
      <div className="toast-message" role="status" aria-live="polite" aria-atomic="true">
        {deleted && <span key={deleted.task.id}><span className="sr-only">{deleted.task.title}: </span>할 일을 삭제했어요</span>}
      </div>
      {deleted && (
        <button ref={buttonRef} type="button" onClick={onUndo} aria-label={`${deleted.task.title} 삭제 되돌리기`}>
          되돌리기
        </button>
      )}
    </div>
  )
}

export default UndoToast

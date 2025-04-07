import { useState } from "react";
import Headline from "../../../types/Headline";
import { updateHeadline } from "../../../api/HeadlinesAPI";

const SiteWidgetCard = ({ headline }: { headline: Headline }) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(headline.title);
  const [text, setText] = useState(headline.text);

  const handleSave = async () => {
    setEditing(false);

    const id = headline.headlineId
    const newHeadline = {
      headlineId: id,
      title,
      text  
    }
    try {
      await updateHeadline(id, newHeadline);
    } catch (error) {
      console.error("Error updating headline:", error);
    }
  };

  return (
    <div className="card shadow-sm mb-3 p-3">
      <div className="card-body">
        {editing ? (
          <>
            <div className="row">
                <div className="col-lg-10">
                    <input
                    className="form-control mb-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    />
                    <textarea
                    className="form-control mb-2"
                    rows={5}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    />
                </div>
                <div className="col-lg-2 text-end">
                    <button className="btn btn-primary mb-2" onClick={handleSave}>
                    Save
                    </button>
                    <br />
                    <button className="btn btn-secondary" onClick={() => setEditing(false)}>
                    Cancel
                    </button>
                </div>
            </div>
          </>
        ) : (
          <>
            <div className="row">
              <div className="col-lg-10">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{text}</p>
              </div>
              <div className="col-lg-2 text-end">
                <button className="btn btn-outline-secondary" onClick={() => setEditing(true)}>
                  Edit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SiteWidgetCard;